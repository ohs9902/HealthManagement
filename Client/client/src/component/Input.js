import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../input.module.css"
import axios from 'axios';

export default function Input()
{   
    const userId = localStorage.getItem('userId');
    const nav = useNavigate();
    const id = localStorage.getItem('userId');
    const [today,setToday] = useState(new Date().toLocaleDateString
    ('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})
    .replace(/\./g,'-').split(' ').join("").slice(0,-1));
    const heightRef = useRef(null);
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

    function hw_input(e){
        e.preventDefault();
        let basal = 0;
        if(myInfo.gender==="male")
            basal = 66+(13.7*weightRef.current.value)+(5*heightRef.current.value)-(6.8*myInfo.age);
        else
            basal = 655+(9.6*weightRef.current.value)+(1.7*heightRef.current.value)-(4.7*myInfo.age);
        axios.post('http://localhost:4000/api/hw_input',
        {
            id:id,
            height:heightRef.current.value,
            weight:weightRef.current.value,
            basal:parseInt(basal)
        }
    ).catch((err)=>{
        console.log(err);
    })
    .then(()=>{
        localStorage.setItem('fc',true);
        localStorage.setItem('height',heightRef.current.value);
        localStorage.setItem('weight',weightRef.current.value);
        alert("신장과 체중이 등록 되었습니다.");
        if(myInfo.activity===null)
            nav(`/id/${id}/activity`);
        else
            nav(`/id/${id}`);
    });
    axios.post('http://localhost:4000/api/weight_change',
        {
            id:id,
            weight:weightRef.current.value,
            date:today
        }
        ).catch((err)=>{
            console.log(err);
        });
    }

    return (
        <div id={styles.hw}>   
            <form onSubmit={hw_input}>
                <p><input className={styles.hw_input} type="text" placeholder="신장(cm)" ref={heightRef}/></p>
                <p><input className={styles.hw_input} type="text" placeholder="체중(kg)" ref={weightRef}/></p>
                <p><button>적용</button></p>
            </form>
        </div>
    );
}