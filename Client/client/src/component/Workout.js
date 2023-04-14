import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "../workout.module.css";
import { v4 as uuidv4 } from 'uuid';
export default function WorkOut()
{
    const userId = localStorage.getItem('userId');
    const [selectedExercise,setSelectedExercise] = useState("none");
    const cardioRef = useRef(null);
    const hoursRef = useRef(null);
    const minuteRef = useRef(null);
    const resistanceRef = useRef(null);
    const repsRef = useRef(null);
    const setsRef = useRef(null);
    const weightRef = useRef(null);
    const [today,setToday] = useState(new Date().toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\./g,'-').split(' ').join("").slice(0,-1));
    const [cardio_list,setCardio_list] = useState([]);
    const [resistance_list,setResistance_list] = useState([]);

    useEffect(()=>{
        const timeId = setInterval(()=>{
            setToday(new Date().toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\./g,'-').split(' ').join("").slice(0,-1));
        },1000);
        return (()=> clearInterval(timeId));
    },[]);

    useEffect(()=>{
        
        axios.post('http://localhost:4000/api/cardio_list',{
            cardio_id:userId,
            date:today
        })
        .then((list)=>{
            setCardio_list(list.data);
        })
        
        axios.post('http://localhost:4000/api/resistance_list',{
            resistance_id:userId,
            date:today
        })
        .then((list)=>{
            setResistance_list(list.data);
        })
    },[])

    function cardio()
    {
        let minute = "";
        if(minuteRef.current.value<10)
            minute = "0"+minuteRef.current.value;
        else
            minute = minuteRef.current.value;
        if(cardioRef.current.value !=="" && hoursRef.current.value!=="" || minute !=="0"){
            axios.post('http://localhost:4000/api/cardio',{
            cardio_id:userId,
            cardio_name:cardioRef.current.value,
            duration:"0"+hoursRef.current.value+":"+minute+":00",
            date:today
            })
            .then(()=>{
                console.log("테스트");
                alert('유산소 운동이 기록됨');
            });
        }else{
            alert("운동이름혹은 시간을 입력하세요.")
        }
    }

    function resistance()
    {
        if(resistanceRef.current.value.length>0&&weightRef.current.value!==""&&weightRef.current.value!==""&&repsRef.current.value!==""&&setsRef.current.value!==""){
            axios.post('http://localhost:4000/api/resistance',{
            resistance_id:userId,
            resistance_name:resistanceRef.current.value,
            weight:weightRef.current.value,
            reps:repsRef.current.value,
            sets:setsRef.current.value,
            date:today  
            })
            .then(()=>{
                
                alert('무산소 운동이 기록됨');
            });
        }else{
            alert("운동정보를 정확히 입력하세요.");
        }
        
    }

    return(
        <div>
            <div id={styles.workout_regist}>
                <h2>운동 기록하기</h2>
                <p>
                    <select className={styles.exc_type} onChange={(e)=>setSelectedExercise(e.target.value)}>
                        <option value="none">운동종류 선택</option>
                        <option value="cardio">유산소 운동</option>
                        <option value="resistance">무산소 운동</option>
                    </select>
                    
                </p>
                {selectedExercise === "cardio" ? 
                (
                    <form onSubmit={cardio}>
                        <p><label className={styles.exc_label}>운동이름</label><input className={styles.inputs} type="text" placeholder="유산소운동 이름" ref={cardioRef}/></p>
                        <p>
                            <label className={styles.exc_label}>운동시간</label>
                            <input className={styles.inputs} type="number" placeholder="시간" min="0" max="6" ref={hoursRef}/>
                            <input className={styles.inputs} type="number" placeholder="분" min="0" max="60" ref={minuteRef}/>
                        </p>
                        <button className={styles.btn}>기록</button>
                    </form>
                )
                :selectedExercise==="resistance" ?(
                    <form onSubmit={resistance}>
                        <p>
                            <label className={styles.exc_label}>운동이름</label><input className={styles.inputs} type="text" placeholder="무산소운동 이름" ref={resistanceRef}/>
                        </p>
                        <p>
                            <label className={styles.exc_label}>운동 중량</label><input className={styles.inputs} type="number" placeholder="중량(kg)" ref={weightRef}/>
                        </p>
                        <p>
                            <label className={styles.exc_label}>운동 횟수</label><input className={styles.inputs} type="number" placeholder="운동횟수" ref={repsRef}/>
                        </p>
                        <p>
                            <label className={styles.exc_label}>운동 세트</label><input className={styles.inputs} type="number" placeholder="세트수" ref={setsRef}/>
                        </p>
                        <button className={styles.btn}>기록</button>
                    </form>
                ):(
                    <p>운동종류를 선택하세요</p>
                )
                }
                <h2>오늘한 운동</h2>
                <h3>유산소 운동</h3>
                {cardio_list.length!==0?
                (
                    <ul className={styles.workout_list}>
                    {
                        cardio_list.map((cardio)=>{
                            let time =cardio.duration.split(":")
                            return(
                                <li key={uuidv4()}>
                                    운동:{cardio.cardio_name} 운동시간:{time[0]} 시간 {time[1]} 분
                                </li>
                        )
                        })
                    }
                </ul>
                ):
                (
                    <p>기록된 유산소운동이 없습니다.</p>
                )
                }
                <h3>무산소 운동</h3>
                {resistance_list.length!==0 ?(
                    <ul className={styles.workout_list}>
                        {
                        resistance_list.map((resistance)=>{
                            return(
                                <li key={uuidv4()}>
                                    운동:{resistance.resistance_name} 중량:{resistance.weight}kg 횟수:{resistance.reps}reps 세트:{resistance.sets}sets
                                </li>
                            );
                        })
                        }   
                    </ul>
                ):
                (
                    <p>기록된 무산소운동이 없습니다.</p>
                )
                }
            </div>
        </div>
    );
}