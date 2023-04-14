import {useParams,Link } from "react-router-dom";
import styles from "../main.module.css"
import {useEffect, useState } from 'react';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Main(){
    const userId = localStorage.getItem('userId');
    const [showToast,setShowToast] = useState(false);
    const [myInfo,setMyInfo] = useState([]);
    const [preWeight,setPreWeight] = useState([]);
    const [today,setToday] = useState(new Date().
    toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})
    .replace(/\./g,'-').split(' ').join("").slice(0,-1));

    useEffect(()=>{
        const timeId = setInterval(()=>{
            setToday(new Date().toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})
            .replace(/\./g,'-').split(' ').join("").slice(0,-1));
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
        if(showToast && (myInfo.weight-preWeight.weight)>=3 && myInfo.weight!==myInfo.target_weight){
            toast(`주간 체중이${myInfo.weight-preWeight.weight}kg으로 너무 급격히 쪘습니다.`);
        }else if(showToast &&(preWeight.weight-myInfo.weight)>=5 && myInfo.weight!==myInfo.target_weight){
            toast(`주간 체중이${preWeight.weight-myInfo.weight}kg으로 너무 급격히 빠졌습니다.`);
        }
    },[showToast])

    useEffect(()=>{
        if(preWeight.weight<myInfo.weight)
        {
            if((myInfo.weight-preWeight.weight)>=3){
                setShowToast(true);
            }
            else
                setShowToast(false); 
        }
        else if(preWeight.weight>myInfo.weight){
            if((preWeight.weight-myInfo.weight)>=5)
                setShowToast(true);
            else
                setShowToast(false);
        }
    },[preWeight,myInfo])


    return (
        <div id={styles.main}>
            <p className={styles.welcome}>{myInfo.name}님 환영합니다</p>
            {myInfo.target_weight!==null && myInfo.target_weight<myInfo.weight ?(
                <p className={styles.weight_status}>현제 체중은{myInfo.weight}kg이고 목표체중{myInfo.target_weight}kg까지 {myInfo.weight-myInfo.target_weight}kg 빼야합니다.</p>
            ):myInfo.target_weight!==null && myInfo.target_weight>myInfo.weight ?(
                <p className={styles.weight_status}>현제 체중은{myInfo.weight}kg이고 목표체중{myInfo.target_weight}kg까지 {myInfo.target_weight-myInfo.weight}kg 찌워야합니다.</p>
            ):myInfo.target_weight!==null && myInfo.target_weight===myInfo.weight?(
                <p className={styles.weight_target}>축하합니다!🎉 목표체중인{myInfo.target_weight}kg에 도달했씁니다.</p>
            )
            :(
                <p className={styles.weight_status}>현제 체중은{myInfo.weight}kg 입니다.</p>
            )
            }
            
            <div>
                <ToastContainer
                position="top-right" // 알람 위치 지정
                autoClose={3000} // 자동 off 시간
                hideProgressBar={false} // 진행시간바 숨김
                closeOnClick // 클릭으로 알람 닫기
                rtl={false} // 알림 좌우 반전
                pauseOnFocusLoss // 화면을 벗어나면 알람 정지
                draggable // 드래그 가능
                pauseOnHover // 마우스를 올리면 알람 정지
                theme="light"
                // limit={1} // 알람 개수 제한
            />
                <p className={styles.today}>{today.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1년$2월$3일')}</p>
                <ul id={styles.menu_list}>
                    <li><Link className={styles.menu} to={"/id/"+userId+"/myinfo"}>회원 상태</Link></li>
                    <li><Link className={styles.menu} to={"/id/"+userId+"/w_input"}>체중 변경</Link></li>
                    <li><Link className={styles.menu} to={"/id/"+userId+"/diet"}>식단 기록</Link></li>
                    <li><Link className={styles.menu} to={"/id/"+userId+"/dietRecord"}>이전 식단</Link></li>
                    <li><Link className={styles.menu} to={"/id/"+userId+"/workout"}>운동 관리</Link></li>
                    <li><Link className={styles.menu} to={"/id/"+userId+"/activity"}>활동량 변경</Link></li>
                </ul>   
            </div>
            <div className={styles.introduce}>
                <p>건강 관리를 위해 <br></br>식단과 운동을 기록할 수 있는<br></br> api를 구현했습니다.</p>
            </div>
        </div>
    );
}