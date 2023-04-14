import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../myinfo.module.css";
import _ from 'lodash';
export default function Myinfo()
{
    const [myInfo,setMyInfo] = useState([]);
    const userId = localStorage.getItem('userId');
    const [today,setToday] = useState(new Date().toLocaleDateString
    ('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})
    .replace(/\./g,'-').split(' ').join("").slice(0,-1));  
    const [preWeight,setPreWeight] = useState([]);
    const [bmi,setBmi] = useState(null);
    const [weeklyCardio, setWeeklyCardio] = useState([]);
    const [weeklyResistance, setWeeklyResistance] = useState([]);


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

    useEffect(()=>{
        const daysAgo = 7;
        const postDate = new Date(new Date(today).getTime() - daysAgo * 24 * 60 * 60 * 1000);
        axios.post('http://localhost:4000/api/week_weight',{
            weight_id:userId,
            date:postDate.toLocaleDateString
            ('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})
            .replace(/\./g,'-').split(' ').join("").slice(0,-1)
        })
        .then((weight)=>{
            setPreWeight(weight.data);
        })
    },[])

    useEffect(()=>{
        const heightInMeter = myInfo.height / 100;
        let bmi = (myInfo.weight/(heightInMeter*heightInMeter))+''.split("");
        setBmi(bmi[0]+bmi[1]+bmi[2]+bmi[3]);
    },[myInfo])

    useEffect(() => {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const mondayDate = new Date(currentDate);
        
        mondayDate.setDate(currentDate.getDate()-currentDay+1)
        axios.post("http://localhost:4000/api/weekly_cardio", {
          userId: userId,
          monday:mondayDate.toLocaleDateString
          ('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})
          .replace(/\./g,'-').split(' ').join("").slice(0,-1),
          current: today,
        }).then((exercise) => {
          const dates = _.uniqBy(exercise.data,'date');
          const localDates = dates.map((date)=>new Date(date.date).toLocaleDateString
          ('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})
          .replace(/\./g,'-').split(' ').join("").slice(0,-1))
          console.log(localDates);
          setWeeklyCardio(localDates);
        });

        axios.post("http://localhost:4000/api/weekly_resistance",{
            userId: userId,
            monday:mondayDate.toLocaleDateString
            ('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})
            .replace(/\./g,'-').split(' ').join("").slice(0,-1),
            current: today,
        }).then((exercise) => {
            const dates = _.uniqBy(exercise.data,'date');
            const localDates = dates.map((date)=>new Date(date.date).toLocaleDateString
            ('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})
            .replace(/\./g,'-').split(' ').join("").slice(0,-1))
            console.log(localDates);
            setWeeklyResistance(localDates);
          });
      }, []);

    return (
        <div id={styles.myinfo}>
            
            <div id={styles.info}>
                <h1>USER STATUS</h1>
                <p className={styles.element}>이름:{myInfo.name}</p>
                {myInfo.gender==='male' ? (
                    <p className={styles.element}>성별:남자</p>
                ):(
                    <p className={styles.element}>성별:여자</p>
                )}
                <p className={styles.element}>신장:{myInfo.height}cm</p>
                <p className={styles.element}>체중:{myInfo.weight}kg</p>
                {myInfo.target_weight!==null ?
                (
                    <p className={styles.element}>목표 체중:{myInfo.target_weight}kg</p>
                ):(
                  <p className={styles.element}>목표체중 설정이 되어있지 않습니다.</p>  
                )

                }
               
                <p className={styles.element}>나이:{myInfo.age}세</p>
                <p className={styles.element}>
                    운동:주간 운동 상태는 유산소운동{weeklyCardio.length}번<br/>무산소운동{weeklyResistance.length}번
                </p>
                <p className={styles.element}>
                    BMI:{bmi} 로
                    {parseFloat(bmi)<18.5 ?
                    (<span> 저체중 입니다.</span>)
                    :parseFloat(bmi)>=18.5 && parseFloat(bmi)<24.9 ?
                    (<span> 정상체중 입니다.</span>)
                    :parseFloat(bmi)>=25 && parseFloat(bmi)<29.9 ?
                    (<span> 과체중 입니다.</span>)
                    :(<span> 비만 입니다.</span>)   
                    }
                </p>    
                {!preWeight.weight ?(
                    <p>기록된 체중변화가 없습니다.</p>
                ):
                preWeight.weight>myInfo.weight ?(
                    <p className={styles.element}>주간 체중변화는 {preWeight.weight}kg 에서<br/> {myInfo.weight}kg 로 
                        <span className={styles.weight_down}>{preWeight.weight-myInfo.weight}kg</span>빠졌습니다.
                    </p>
                ):preWeight.weight===myInfo.weight ?(
                    <p className={styles.element}>체중 변화없이 {preWeight.weight}kg 을 유지중<br/> 입니다.</p>
                ):
                (
                    <p className={styles.element}>주간 체중변화는 {preWeight.weight}kg 에서<br/> {myInfo.weight}kg 로 
                        <span className={styles.weight_up}>{myInfo.weight-preWeight.weight}kg</span> 올랐습니다.
                    </p>
                )
                }
            </div>
        </div>
    );
}