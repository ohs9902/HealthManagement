import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../input.module.css"
import axios from 'axios';

export default function Winput()
{   
    const userId = localStorage.getItem('userId');
    const [today,setToday] = useState(new Date().toLocaleDateString
    ('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})
    .replace(/\./g,'-').split(' ').join("").slice(0,-1));
    const nav = useNavigate();
    const id = localStorage.getItem('userId');
    const weightRef = useRef(null);
    const [myInfo,setMyInfo] = useState([]);

    useEffect(()=>{
        const timeId = setInterval(()=>{
            setToday(new Date().toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\./g,'-').split(' ').join("").slice(0,-1));
        },1000);
        return (()=> clearInterval(timeId));
    },[]);

    useEffect(()=>{
        axios.post('http://localhost:4000/api/myInfo',{
            id:userId
        })
        .then((info)=>{
            setMyInfo(info.data);
        });
    },[]);
    
    function w_input(e){
        e.preventDefault();
        let basal = 0;
        if(myInfo.gender==="male")
            basal = 66+(13.7*weightRef.current.value)+(5*myInfo.height)-(6.8*myInfo.age);
        else
            basal = 655+(9.6*weightRef.current.value)+(1.7*myInfo.height)-(4.7*myInfo.age);
        axios.post('http://localhost:4000/api/w_input',
        {
            id:id,
            weight:weightRef.current.value,
            basal:parseInt(basal)
        }
        ).catch((err)=>{
            console.log(err);
        })
        .then(()=>{
            localStorage.setItem('weight',weightRef.current.value);
            alert("체중이 변경 되었습니다.");
            nav(`/id/${id}`);
        }
        );

        axios.post('http://localhost:4000/api/weight_change',
        {
            id:id,
            weight:weightRef.current.value,
            date:today
        }
        ).catch((err)=>{
            console.log(err);
        })
        .then(()=>{
            nav(`/id/${id}/weight_change`);
        })
    }

    return (
        <div id={styles.hw}>
            <h1>체중변경</h1>   
            <form onSubmit={w_input}>
                <p><input className={styles.hw_input} type="number" placeholder="체중(kg) 변화가 기록됨." ref={weightRef}/></p>
                <p><button className={styles.hw_input}>적용</button></p>
            </form>
        </div>
    );
}