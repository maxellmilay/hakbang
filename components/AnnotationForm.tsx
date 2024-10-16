"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface PropsInterface {
    pickedCoordinates: Array<number>;
    setShowAnnotationForm: (show: boolean) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveAnnotation: (data: any) => void;
    setPickedCoordinates: React.Dispatch<
        React.SetStateAction<[number, number] | null>
    >;
}

function AnnotationForm(props: PropsInterface) {
    const {
        pickedCoordinates,
        setShowAnnotationForm,
        saveAnnotation,
        setPickedCoordinates,
    } = props;
    const walkabiltyChoices = [
        "Excellent",
        "Very Good",
        "Fair",
        "Good",
        "Poor",
    ];
    const [choosenWalkabilityIndex, setChoosenWalkabilityIndex] = useState(0);

    const [accessibilityFeatures, setAccessibilityFeatures] = useState([
        {
            checked: false,
            label: "Ramp",
        },
        {
            checked: false,
            label: "Tactile paving",
        },
        {
            checked: false,
            label: "Audible signals",
        },
        {
            checked: false,
            label: "Braille signs",
        },
        {
            checked: false,
            label: "Wide doorways",
        },
        {
            checked: false,
            label: "Elevators",
        },
        {
            checked: false,
            label: "Accessible toilets",
        },
        {
            checked: false,
            label: "Handrails",
        },
        {
            checked: false,
            label: "Lowered counters",
        },
        {
            checked: false,
            label: "Accessible parking",
        },
    ]);

    const save = () => {
        const data = "hello world";
        saveAnnotation(data);
    };

    return (
        <div className="absolute right-0 top-0 z-[100] w-lvw h-lvh bg-black/[.7] flex items-center justify-center">
            <div className="flex flex-col bg-white rounded-md shadow-lg w-[520px] h-[700px]">
                <div className="flex items-center justify-between px-6 py-4">
                    <h1 className="font-semibold text-2xl">New annotation</h1>
                    <button
                        onClick={() => setShowAnnotationForm(false)}
                        className="bg-primary rounded-md border-2 border-black
                    duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <Icon
                            icon="material-symbols:close-rounded"
                            className="w-5 h-5"
                        />
                    </button>
                </div>
                <div className="flex flex-col px-6 py-2 gap-3 overflow-y-auto">
                    <p className="text-slate-600 text-sm">
                        Coordinates: {pickedCoordinates[0]},{" "}
                        {pickedCoordinates[1]}
                    </p>
                    <TextField
                        label="Street Name"
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="Annotated by"
                        variant="outlined"
                        size="small"
                    />
                    <Divider />
                    <TextField
                        label="Sidewalk width"
                        variant="outlined"
                        size="small"
                    />
                    <div className="flex flex-col gap-2">
                        <p className="text-slate-600">Walkability</p>
                        <div className="flex gap-1 flex-wrap text-sm">
                            {walkabiltyChoices.map((choice, index) => (
                                <button
                                    onClick={() =>
                                        setChoosenWalkabilityIndex(index)
                                    }
                                    key={index}
                                    className={`flex p-2 gap-2 items-center rounded-md border-2 hover:bg-primary-light transition-all duration-200 ease-in-out
                                        ${
                                            index === choosenWalkabilityIndex
                                                ? "border-primary bg-primary-light"
                                                : "border-transparent"
                                        }`}
                                >
                                    <div
                                        className={`w-4 h-4 rounded-md border-2 border-black
                                            bg-level-${index + 1}`}
                                    ></div>
                                    {choice}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-slate-600">Accessibility features</p>
                        <div className="flex flex-col px-3 text-sm">
                            {accessibilityFeatures.map((feature, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={feature.checked}
                                            onChange={(e) => {
                                                const updatedFeatures = [
                                                    ...accessibilityFeatures,
                                                ];
                                                updatedFeatures[index].checked =
                                                    e.target.checked;
                                                setAccessibilityFeatures(
                                                    updatedFeatures
                                                );
                                            }}
                                            name={feature.label}
                                        />
                                    }
                                    label={feature.label}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end gap-2 px-6 py-4">
                    <button
                        onClick={() => {
                            setPickedCoordinates(null);
                            setShowAnnotationForm(false);
                        }}
                        className="flex gap-1 items-center px-3 py-2 border-2 border-black rounded-md bg-white
                    duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <Icon
                            icon="material-symbols:my-location"
                            className="w-4 h-4"
                        />
                        Reposition
                    </button>
                    <button
                        onClick={save}
                        className="flex gap-1 items-center px-3 py-2 border-2 border-black rounded-md bg-primary
                                    duration-100 ease-in-out hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-5px_5px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <Icon
                            icon="material-symbols:check"
                            className="w-4 h-4"
                        />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AnnotationForm;
