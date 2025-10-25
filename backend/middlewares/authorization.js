// @desc    Check if user has admin role
// @access  Admin only
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

// @desc    Check if user has admin or moderator role
// @access  Admin/Moderator
const requireModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!["admin", "moderator"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Moderator or admin access required",
    });
  }

  next();
};

// @desc    Check if user can access resource (own resource or admin)
// @access  Owner or Admin
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const resourceUserId = req.params.id || req.params.userId;

  // Allow if user is admin or accessing their own resource
  if (req.user.role === "admin" || req.user.userId === resourceUserId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. You can only access your own resources.",
  });
};

// @desc    Role-based access control
// @access  Based on roles array
const requireRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

export {
  requireAdmin,
  requireModerator,
  requireOwnershipOrAdmin,
  requireRoles,
};
