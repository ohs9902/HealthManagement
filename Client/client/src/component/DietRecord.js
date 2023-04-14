import {useState} from "react";
import {Calendar} from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from "react-router-dom";
import styles from "../dietRecord.module.css";

export default function DietRecord()
{
    const userId = localStorage.getItem('userId')
    const [calendar,setCalendar] = useState(new Date());
    const nav = useNavigate();
   
    const handleDate = (date)=>{
        let zero = "";
        let zero2 = "";
        if((date.getMonth()+1)<10)
           zero="0";  
        if(date.getDate()<10)
           zero2="0";
        nav(`/id/${userId}/dietRecord/${date.getFullYear()}-${zero}${date.getMonth()+1}-${zero2}${date.getDate()}`);
    }

    return (
        <div>
            <p className={styles.intro}>식단을 확인할 날짜를 선택하세요.</p>
            <div id={styles.calendar}>
                <Calendar onChange={setCalendar} value={calendar} onClickDay={handleDate} />
            </div>
        </div>
        
    );
}