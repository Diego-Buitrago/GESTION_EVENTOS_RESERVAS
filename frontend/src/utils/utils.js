import moment from "moment"

export const formDate = (date) => {
    return new Date(moment(date).format("YYYY"), moment(date).format("MM") - 1, moment(date).format("DD"));
};

export const propsDataTable = {
    showGridlines: true,
    stripedRows: true,
    scrollable: true,
    paginator: true,
    lazy: true,
    size: "small",
    emptyMessage: "No se encontraron datos",
    paginatorTemplate: "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
    currentPageReportTemplate: "{first} a {last} de {totalRecords}",
    rowsPerPageOptions: [5, 10, 20, 50],
};

export const propsCalendar = {
    showButtonBar: true,
    showIcon: true,
    readOnlyInput: true,
    dateFormat: "yy-mm-dd",
    monthNavigator: "true",
    yearNavigator: "true",
    yearRange: "2000:2050",
};

export const propsSelect = {
    resetFilterOnHide: true,
    emptyMessage: "No Hay Datos",
    emptyFilterMessage: "No Hay Datos",
    optionLabel: "value",
    filterBy: "value",
    optionValue: "value",
    filter: true,
    showClear: true,
};

export const statusReservation = [  
    { value: "pendiente"  },
    { value: "confirmada"  },
    { value: "cancelada" }
]    