interface Checkbox {
    label: string
    checked: boolean
}

export interface FormItem {
    type: string
    label: string
    checkboxList: Checkbox[]
}

export interface Form {
    name: string
    form_data: FormItem[]
}
