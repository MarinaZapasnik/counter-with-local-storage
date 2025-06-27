import { ChangeEvent, useState } from "react";
import "./App.css";


export const Counter = () => {

    const setValuesToLocalStorage = (minValue:number, maxValue:number) => {
        localStorage.setItem('minValueKey', JSON.stringify(minValue))
        localStorage.setItem('maxValueKey', JSON.stringify(maxValue))
    }
    const setCountToLocalStorage = (count: number | null) => {
        localStorage.setItem('countKey', JSON.stringify(count))
    }

    const getValuesFromLocalStorage = () => {
        let minValueFromLS = localStorage.getItem('minValueKey')
        let maxValueFromLS = localStorage.getItem('maxValueKey')
        
        if (minValueFromLS && maxValueFromLS) {
            return ({
                minValue: JSON.parse(minValueFromLS),
                maxValue: JSON.parse(maxValueFromLS)
            })
        } else {
            return ({
                minValue: 0,
                maxValue: 5
            })
        }
    }
    const getCountFromLocalStorage = () => {
        let countFromLS = localStorage.getItem('countKey')
        return countFromLS ? JSON.parse(countFromLS) : 0
    }

    
    const  MIN_LIMIT_VALUE:number = 0 
    const  MAX_LIMIT_VALUE:number = 100 

    const initialMessage = (minValue: number, maxValue: number, count: number | null) => {
        if (count) {
            return null
        }  

        if (minValue >= MIN_LIMIT_VALUE 
            && maxValue <= MAX_LIMIT_VALUE 
            && minValue < maxValue) {
                return "enter values and press 'set'"
            } else { 
                return "incorrect value!"
            }

    }


    type MessageProps = "enter values and press 'set'" | "incorrect value!" | null

    type ValuesProps = {
        minValue: number 
        maxValue: number 
    }

    const [values, setValues] = useState<ValuesProps>(getValuesFromLocalStorage())
    const [count, setCount] = useState<number | null>(getCountFromLocalStorage());
    const [message, setMessage] = useState<MessageProps>(initialMessage(values.minValue, values.maxValue, count));
    const [isSetDisabled, setSetDisabled] = useState<boolean>(message === 'incorrect value!')
    const [isIncDisabled, setIncDisabled] = useState<boolean>(true)
    const [isResetDisabled, setResetDisabled] = useState<boolean>(!!message)

    const isIncorrectValues = (minValue: number, maxValue: number): boolean => {
            return minValue < MIN_LIMIT_VALUE ||
                maxValue > MAX_LIMIT_VALUE || 
                minValue >= maxValue
        };



    const getValuesHandler = (event: ChangeEvent<HTMLInputElement>, value: 'minValue' | 'maxValue') => {
        setMessage("enter values and press 'set'")
        setCount(null)
        setCountToLocalStorage(null)
        const newValue = Number(event.target.value)
        const newValues = {...values, [value]: newValue}
        setValues(newValues)

        const isIncorrect = isIncorrectValues(newValues.minValue, newValues.maxValue);

            setMessage(isIncorrect ? 'incorrect value!' : 'enter values and press \'set\'')
            setSetDisabled(isIncorrect ? true : false)
            
                
        setValuesToLocalStorage(newValues.minValue, newValues.maxValue)
    }    

    const setCountHandler = () => {

        if (values.minValue >= MIN_LIMIT_VALUE && values.maxValue <= MAX_LIMIT_VALUE && values.minValue <= values.maxValue) {
            setMessage(null)
            setCount(values.minValue)
            setSetDisabled(true)
            setIncDisabled(false)
            setResetDisabled(false)
            setCountToLocalStorage(values.minValue)
        } 
    }

    const incrementHahdler = () => {
        
        if (typeof(count) === 'number') {
            const newCount = count + 1
            setCount(newCount)
            setCountToLocalStorage(newCount)
        if (count >= values.maxValue - 1) {
                setIncDisabled(true)
        }
        }
    }

    const resetHandler = () => {
        setIncDisabled(false)
        setCount(values.minValue)
        setCountToLocalStorage(values.minValue)
    }

    const setSettingsHandler = () => {
        setSetDisabled(message === 'incorrect value!')
        setIncDisabled(true)
        setResetDisabled(true)
        setCount(null)
        const isIncorrect = isIncorrectValues(values.minValue, values.maxValue);
        setMessage(isIncorrect ? 'incorrect value!' : "enter values and press 'set'")
    }
    

    return (
        <div className="Counter">

            <div className="container">

                <div className="block" style={{gap: '15px'}}>

                    <div style={{display: 'flex', gap: '20px'}}>
                        <label className="label">max value:</label>
                        <input 
                            value={values.maxValue}
                            className={
                                (values.maxValue !== undefined 
                                    && (values.maxValue > MAX_LIMIT_VALUE 
                                        || values.maxValue <= values.minValue!))
                                        ? 'inputerror' : 'input'} 
                            type="number"
                            step={1}
                            onClick={setSettingsHandler}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => getValuesHandler(event, 'maxValue')}
                        />    
                    </div>
                    <div style={{display: 'flex', gap: '20px'}}>
                        <label className="label">start value:</label>
                        <input 
                            value={values.minValue}
                            className={
                                (values.minValue !== undefined 
                                    && (values.minValue < MIN_LIMIT_VALUE 
                                        || values.minValue >= values.maxValue!))
                                        ? 'inputerror' : 'input'}  
                            type="number"
                            step={1}                          
                            onChange={(event: ChangeEvent<HTMLInputElement>) => getValuesHandler(event, 'minValue')}
                            onClick={setSettingsHandler}    
                        />    
                    </div>    
                    
                </div>

                <div className='buttonFrame' >
                    <button 
                        disabled={isSetDisabled}
                        className="btn"
                        onClick={setCountHandler}>
                            set
                    </button>
                </div>

            </div>
        

            <div className="container">

                <div className="block">
                    <h2 className={count === values.maxValue ? 'bigredcount' : 'count'}>
                        {count}
                    </h2>
                    <h2 className={message === "incorrect value!" ? 'redtext' : 'text'}>
                        {message}
                    </h2>
                </div>

                <div className='buttonFrame'>
                    <button 
                        disabled={isIncDisabled}
                        className="btn"
                        onClick={incrementHahdler}>
                            inc
                    </button>
                    <button 
                        disabled={isResetDisabled}
                        className="btn"
                        onClick={resetHandler}>
                            reset
                    </button> 
                </div>

            </div>

        </div>
    
    );
};
