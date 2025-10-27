import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcommerceComponent } from './theme/dashboard/ecommerce/ecommerce.component';
import { ComingSoonPageComponent } from './common/coming-soon-page/coming-soon-page.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { StarterComponent } from './common/starter/starter.component';
import { AccordionComponent } from './shared/ui-elements/accordion/accordion.component';
import { AlertsComponent } from './shared/ui-elements/alerts/alerts.component';
import { AutocompleteComponent } from './shared/ui-elements/autocomplete/autocomplete.component';
import { AvatarsComponent } from './shared/ui-elements/avatars/avatars.component';
import { BadgesComponent } from './shared/ui-elements/badges/badges.component';
import { BottomSheetComponent } from './shared/ui-elements/bottom-sheet/bottom-sheet.component';
import { BreadcrumbComponent } from './shared/ui-elements/breadcrumb/breadcrumb.component';
import { ButtonToggleComponent } from './shared/ui-elements/button-toggle/button-toggle.component';
import { ButtonsComponent } from './shared/ui-elements/buttons/buttons.component';
import { CardsComponent } from './shared/ui-elements/cards/cards.component';
import { CarouselsComponent } from './shared/ui-elements/carousels/carousels.component';
import { CheckboxComponent } from './shared/ui-elements/checkbox/checkbox.component';
import { ChipsComponent } from './shared/ui-elements/chips/chips.component';
import { ClipboardComponent } from './shared/ui-elements/clipboard/clipboard.component';
import { DatepickerComponent } from './shared/ui-elements/datepicker/datepicker.component';
import { DialogComponent } from './shared/ui-elements/dialog/dialog.component';
import { DividerComponent } from './shared/ui-elements/divider/divider.component';
import { DragDropComponent } from './shared/ui-elements/drag-drop/drag-drop.component';
import { ExpansionComponent } from './shared/ui-elements/expansion/expansion.component';
import { FormFieldComponent } from './shared/ui-elements/form-field/form-field.component';
import { GridListComponent } from './shared/ui-elements/grid-list/grid-list.component';
import { IconComponent } from './shared/ui-elements/icon/icon.component';
import { InputComponent } from './shared/ui-elements/input/input.component';
import { ListComponent } from './shared/ui-elements/list/list.component';
import { ListboxComponent } from './shared/ui-elements/listbox/listbox.component';
import { MenusComponent } from './shared/ui-elements/menus/menus.component';
import { PaginationComponent } from './shared/ui-elements/pagination/pagination.component';
import { ProgressBarComponent } from './shared/ui-elements/progress-bar/progress-bar.component';
import { RadioComponent } from './shared/ui-elements/radio/radio.component';
import { RatioComponent } from './shared/ui-elements/ratio/ratio.component';
import { SelectComponent } from './shared/ui-elements/select/select.component';
import { SidenavComponent } from './shared/ui-elements/sidenav/sidenav.component';
import { SlideToggleComponent } from './shared/ui-elements/slide-toggle/slide-toggle.component';
import { SliderComponent } from './shared/ui-elements/slider/slider.component';
import { SnackbarComponent } from './shared/ui-elements/snackbar/snackbar.component';
import { StepperComponent } from './shared/ui-elements/stepper/stepper.component';
import { TableComponent } from './shared/ui-elements/table/table.component';
import { TabsComponent } from './shared/ui-elements/tabs/tabs.component';
import { ToolbarComponent } from './shared/ui-elements/toolbar/toolbar.component';
import { TreeComponent } from './shared/ui-elements/tree/tree.component';
import { TypographyComponent } from './shared/ui-elements/typography/typography.component';
import { UiElementsComponent } from './shared/ui-elements/ui-elements.component';
import { UtilitiesComponent } from './shared/ui-elements/utilities/utilities.component';
import { VideosComponent } from './shared/ui-elements/videos/videos.component';
import { ApexchartsComponent } from './theme/charts/apexcharts/apexcharts.component';
import { ChartsComponent } from './theme/charts/charts.component';
import { GaugeComponent } from './theme/charts/gauge/gauge.component';
import { AdvancedElementsComponent } from './theme/forms/advanced-elements/advanced-elements.component';
import { BasicElementsComponent } from './theme/forms/basic-elements/basic-elements.component';
import { EditorsComponent } from './theme/forms/editors/editors.component';
import { FileUploaderComponent } from './theme/forms/file-uploader/file-uploader.component';
import { FormsComponent } from './theme/forms/forms.component';
import { WizardComponent } from './theme/forms/wizard/wizard.component';
import { IconsComponent } from './theme/icons/icons.component';
import { MaterialSymbolsComponent } from './theme/icons/material-symbols/material-symbols.component';
import { RemixiconComponent } from './theme/icons/remixicon/remixicon.component';
import { MyProfileComponent } from './theme/my-profile/my-profile.component';
import { AccountSettingsComponent } from './theme/settings/account-settings/account-settings.component';
import { ChangePasswordComponent } from './theme/settings/change-password/change-password.component';
import { ConnectionsComponent } from './theme/settings/connections/connections.component';
import { PrivacyPolicyComponent } from './theme/settings/privacy-policy/privacy-policy.component';
import { SettingsComponent } from './theme/settings/settings.component';
import { TermsConditionsComponent } from './theme/settings/terms-conditions/terms-conditions.component';
import { BasicTableComponent } from './theme/tables/basic-table/basic-table.component';
import { DataTableComponent } from './theme/tables/data-table/data-table.component';
import { TablesComponent } from './theme/tables/tables.component';
import { WidgetsComponent } from './theme/widgets/widgets.component';
import { TooltipComponent } from './shared/ui-elements/tooltip/tooltip.component';
import { ColorPickerComponent } from './shared/ui-elements/color-picker/color-picker.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'authentication',
        pathMatch: 'full',
    },
    { path: 'dashboard', component: EcommerceComponent },

    {
        path: 'authentication',
        loadChildren: () =>
            import('@src/app/authentication/auth.module').then(
                (m) => m.AuthModule
            ),
    },
    {
        path: 'user',
        loadChildren: () =>
            import('./user/user.module').then((m) => m.UserModule),
    },
    // {
    //   path: 'admin',
    //   loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
    // },

    // Extra Pages

    { path: 'starter', component: StarterComponent },

    {
        path: 'icons',
        component: IconsComponent,
        children: [
            { path: '', component: MaterialSymbolsComponent },
            { path: 'remixicon', component: RemixiconComponent },
        ],
    },
    { path: 'my-profile', component: MyProfileComponent },
    {
        path: 'settings',
        component: SettingsComponent,
        children: [
            { path: '', component: AccountSettingsComponent },
            { path: 'change-password', component: ChangePasswordComponent },
            { path: 'connections', component: ConnectionsComponent },
            { path: 'privacy-policy', component: PrivacyPolicyComponent },
            { path: 'terms-conditions', component: TermsConditionsComponent },
        ],
    },

    { path: 'coming-soon', component: ComingSoonPageComponent },

    { path: 'internal-error', component: InternalErrorComponent },
    { path: 'widgets', component: WidgetsComponent },
    {
        path: 'charts',
        component: ChartsComponent,
        children: [
            { path: '', component: ApexchartsComponent },
            { path: 'gauge', component: GaugeComponent },
        ],
    },
    {
        path: 'tables',
        component: TablesComponent,
        children: [
            { path: '', component: BasicTableComponent },
            { path: 'data-table', component: DataTableComponent },
        ],
    },
    {
        path: 'ui-kit',
        component: UiElementsComponent,
        children: [
            { path: '', component: AlertsComponent },
            { path: 'autocomplete', component: AutocompleteComponent },
            { path: 'avatars', component: AvatarsComponent },
            { path: 'accordion', component: AccordionComponent },
            { path: 'badges', component: BadgesComponent },
            { path: 'breadcrumb', component: BreadcrumbComponent },
            { path: 'button-toggle', component: ButtonToggleComponent },
            { path: 'bottom-sheet', component: BottomSheetComponent },
            { path: 'buttons', component: ButtonsComponent },
            { path: 'cards', component: CardsComponent },
            { path: 'carousels', component: CarouselsComponent },
            { path: 'checkbox', component: CheckboxComponent },
            { path: 'chips', component: ChipsComponent },
            { path: 'color-picker', component: ColorPickerComponent },
            { path: 'clipboard', component: ClipboardComponent },
            { path: 'datepicker', component: DatepickerComponent },
            { path: 'dialog', component: DialogComponent },
            { path: 'divider', component: DividerComponent },
            { path: 'drag-drop', component: DragDropComponent },
            { path: 'expansion', component: ExpansionComponent },
            { path: 'form-field', component: FormFieldComponent },
            { path: 'grid-list', component: GridListComponent },
            { path: 'input', component: InputComponent },
            { path: 'icon', component: IconComponent },
            { path: 'list', component: ListComponent },
            { path: 'listbox', component: ListboxComponent },
            { path: 'menus', component: MenusComponent },
            { path: 'pagination', component: PaginationComponent },
            { path: 'progress-bar', component: ProgressBarComponent },
            { path: 'radio', component: RadioComponent },
            { path: 'ratio', component: RatioComponent },
            { path: 'select', component: SelectComponent },
            { path: 'sidenav', component: SidenavComponent },
            { path: 'slide-toggle', component: SlideToggleComponent },
            { path: 'slider', component: SliderComponent },
            { path: 'snackbar', component: SnackbarComponent },
            { path: 'stepper', component: StepperComponent },
            { path: 'typography', component: TypographyComponent },
            { path: 'tooltip', component: TooltipComponent },
            { path: 'toolbar', component: ToolbarComponent },
            { path: 'table', component: TableComponent },
            { path: 'tabs', component: TabsComponent },
            { path: 'tree', component: TreeComponent },
            { path: 'videos', component: VideosComponent },
            { path: 'utilities', component: UtilitiesComponent },
        ],
    },
    {
        path: 'forms',
        component: FormsComponent,
        children: [
            { path: '', component: BasicElementsComponent },
            { path: 'advanced-elements', component: AdvancedElementsComponent },
            { path: 'wizard', component: WizardComponent },
            { path: 'editors', component: EditorsComponent },
            { path: 'file-uploader', component: FileUploaderComponent },
        ],
    },

    // Here add new pages component
    { path: '**', component: NotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
