import React, {useState} from "react";
import './form.scss';

export const Form = () => {
    const FORM_FIELDS_LENGTH = 2;
    const [lineId, setLineId] = useState(1);
    const uniqueValuesForKeys = ['第一', '第二', '第三'];

    const initialFormValues = [{type: "email", value: "", id: lineId}];
    const [formValues, setFormValues] = useState(initialFormValues);

    const handleEventChange = (evt, index) => {
        const {name, value} = evt.target;
        const formLines = [...formValues];
        formLines[index][name] = value;
        setFormValues(formLines);
    }

    const addFormField = () => {
        setLineId(lineId + 1);
        if (formValues.length <= FORM_FIELDS_LENGTH) {
            setFormValues([
                ...formValues,
                {type: "email", value: "", id: lineId + 1}
            ]);
        }
    }

    const removeFieldHandler = (id) => {
        if (formValues.length > 1) {
            setFormValues(formValues.filter(fieldLine => fieldLine.id !== id));
        }
    }

    const [emptyField, setEmptyField] = useState(true);
    const formFieldsLengthHandler = formValues.filter(element => element.value.length <= 0);

    const [dataSubmitter, setDataSubmitter] = useState(false);

    const [properFormInputValue, setProperFormInputValue] = useState(false);
    const mailCondition = (email) => {
        if(!!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            setProperFormInputValue(true);
        }
    }

    const resultOfFormValues = {};

    const getFormValues = (array) => {
        for (const object of array) {
            for (const key of Object.keys(object)) {
                if (resultOfFormValues?.[key]) {
                    resultOfFormValues[key] = [...resultOfFormValues[key], object[key]];
                } else {
                    resultOfFormValues[key] = [object[key]];
                }
            }
        }
        return resultOfFormValues;
    }
    const convertArrayToObject = object => Object.keys(object).map((element, index) => {
        const result = {};
        Object.keys(object).forEach(key => {
            if (object[key][index]) {
                result[key] = object[key][index]
            }
        })
        return result;
    })

    const transformedFormValues =getFormValues(formValues);
    const convertedFormValues = convertArrayToObject(transformedFormValues).filter(value => !!value.value);

    return (
        <div className='form'>
            <h1 className='form__header'>{!dataSubmitter ? 'Please leave us your contacts' : 'Thank you for your feedback!'}</h1>
            {!dataSubmitter && <div className='form__form-fields'>
                {formValues.map((line, index) => {
                    return (
                        <div
                            key={uniqueValuesForKeys[index]}
                            className='form__form-field'
                        >
                            <select
                                className='form__select'
                                name='type'
                                value={line.type}
                                onChange={evt => {
                                    handleEventChange(evt, index)
                                }}>
                                <option value='email'>Email</option>
                                <option value='phone'>Phone</option>
                                <option value='link'>Link</option>
                            </select>
                            <input
                                className='form__input'
                                name='value'
                                value={line.value}
                                placeholder={`please enter your ${line.type}`}
                                onChange={evt => {
                                    handleEventChange(evt, index)
                                    setEmptyField(evt.target.value.length <= 0)
                                    if(line.type === 'email') {
                                        mailCondition(evt.target.value);
                                    } else {
                                        setProperFormInputValue(true);
                                    }
                                }}
                                type='text'/>
                            <button
                                className='form__button form__button-add'
                                onClick={() => {
                                    addFormField();
                                    setEmptyField(true);
                                    setProperFormInputValue(false);
                                }
                                }>+
                            </button>
                            <button
                                className='form__button form__button-remove'
                                onClick={() => {
                                    removeFieldHandler(line.id);
                                }}>-
                            </button>
                        </div>
                    )
                })}
                <button
                    className='form__button form__button-submit'
                    disabled={emptyField || formFieldsLengthHandler.length || !properFormInputValue}
                    onClick={() => {
                        setDataSubmitter(true);
                    }}>Submit
                </button>
            </div>}
            {dataSubmitter &&
            <div className='form__data-sent'>
                <div className='form__data-sent-block'>
                    <h4 className='form__data-sent-header'>getFormValues method:</h4>
                    {JSON.stringify(transformedFormValues)}
                </div>
                <br/>
                <div className='form__data-sent-block'>
                    <h4 className='form__data-sent-header'>convertArrayToObject method:</h4>
                    {JSON.stringify(convertedFormValues)}
                </div>
            </div>
            }
        </div>
    )
}