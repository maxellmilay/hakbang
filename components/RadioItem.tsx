import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'

interface PropsInterface {
    header: string
    label: string
    options: string[]
    allowOther?: boolean
    setValue: (value: string) => void
}

function RadioItem(props: PropsInterface) {
    const { header, label, options, allowOther, setValue } = props
    const [selectedValue, setSelectedValue] = useState<string>('')
    const [otherValue, setOtherValue] = useState<string>('')

    useEffect(() => {
        if (selectedValue === 'Other') {
            setValue(otherValue)
        } else {
            setValue(selectedValue)
        }
    }, [selectedValue, otherValue])

    return (
        <>
            <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                    <span className="font-bold">{header}</span> {label}
                </FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    onChange={(e) => setSelectedValue(e.target.value)}
                >
                    {options.map((option) => (
                        <FormControlLabel
                            key={option}
                            value={option}
                            control={<Radio />}
                            label={option}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
            {allowOther && selectedValue === 'Other' && (
                <TextField
                    label="Other"
                    variant="outlined"
                    size="small"
                    onChange={(e) => setOtherValue(e.target.value)}
                />
            )}
        </>
    )
}

export default RadioItem
