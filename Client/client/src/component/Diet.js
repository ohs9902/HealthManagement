import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../diet.module.css";
export default function Diet()
{
    const [today,setToday] = useState(new Date().toLocaleDateString
    ('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'})
    .replace(/\./g,'-').split(' ').join("").slice(0,-1));
    const userId=localStorage.getItem('userId');
    const [breakfasts,setBreakfasts] = useState([]);
    const [lunchs,setLunchs] = useState([]);
    const [dinners,setDinners] = useState([]);
    const [totalK,setTotalK] = useState(null);
    const [totalP,setTotalP] = useState(null);
    const [totalF,setTotalF] = useState(null);
    const [totalC,setTotalC] = useState(null);
    
    useEffect(()=>{
        const timeId = setInterval(()=>{
            setToday(new Date().toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\./g,'-').split(' ').join("").slice(0,-1));
        },1000);
        return (()=> clearInterval(timeId));
    },[]);

    useEffect(()=>{
        axios.post('http://localhost:4000/api/breakfast_list',{
            user_id:userId,
            meal_time:'breakfast',
            date:today
        }).then((food_list)=>{
            setBreakfasts(food_list.data);
        })
    },[today]);

    useEffect(()=>{
        axios.post('http://localhost:4000/api/breakfast_list',{
            user_id:userId,
            meal_time:'lunch',
            date:today
        }).then((food_list)=>{
            setLunchs(food_list.data);
        })
    },[today]);

    useEffect(()=>{
        axios.post('http://localhost:4000/api/breakfast_list',{
            user_id:userId,
            meal_time:'dinner',
            date:today
        }).then((food_list)=>{
            setDinners(food_list.data);
        })
    },[today]);

    useEffect(()=>{
        totalKcl();
    },[breakfasts,lunchs,dinners]);
    
    function totalKcl(){
        let totalkcl = 0;
        let totalFat = 0;
        let totalProtein = 0;
        let totalCarbo = 0;
        breakfasts.forEach((food)=>{
            totalkcl +=food.kcl;
            totalFat +=food.fat;
            totalProtein +=food.protein;
            totalCarbo +=food.carbo;
        });
        lunchs.forEach((food)=>{
            totalkcl +=food.kcl;
            totalFat +=food.fat;
            totalProtein +=food.protein;
            totalCarbo +=food.carbo;
        });
        dinners.forEach((food)=>{
            totalkcl +=food.kcl;
            totalFat +=food.fat;
            totalProtein +=food.protein;
            totalCarbo +=food.carbo;
        });
        setTotalK(totalkcl);
        setTotalF(totalFat);
        setTotalP(totalProtein);
        setTotalC(totalCarbo);
    }
    function deleteFood(diet_num,meal_times)
    {
        axios.post('http://localhost:4000/api/diet_delete',{
            user_id:userId,
            meal_time:meal_times,
            diet_num:diet_num,
            date:today
        }).then(()=>{
            setBreakfasts((prevList)=>prevList.filter((food)=> food.diet_num!==diet_num));
            setLunchs((prevList)=>prevList.filter((food)=> food.diet_num!==diet_num));
            setDinners((prevList)=>prevList.filter((food)=> food.diet_num!==diet_num));
        });
    }

    return (
        <div id={styles.diet}>
            <h1 id={styles.date}>{today.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1년$2월$3일')} 식단</h1>
            {breakfasts.length===0&&lunchs.length===0&&dinners.length===0 ?
             (
                <p>식단을 등록하세요 등록된 식단이 없습니다.</p>
             ):(
                <></>
             )
            }
            <p id={styles.total}>총 섭취 칼로리:{parseInt(totalK)}kcal 단백질:{parseInt(totalP)}g 지방:{parseInt(totalF)}g 탄수화물:{parseInt(totalC)}g </p>
            <p><Link className ={styles.meal_time}to={"/id/"+userId+"/diet/breakfast"}>아침+</Link></p>
            <ul className={styles.diet_list}>
                {breakfasts.map((food)=>{
                    return(
                    <li key={food.diet_num}>
                    식품명:{food.food},식품종류:{food.food_type},칼로리:{parseInt(food.kcl)}kcal,단백질:{parseInt(food.protein)}g{""},
                    지방:{parseInt(food.fat)}g,탄수화물:{parseInt(food.carbo)}g,섭취량:{parseInt(food.serving_size)}g<button className={styles.diet_btn} onClick={()=>deleteFood(food.diet_num,food.meal_time)}>삭제</button>
                    </li>
                )})

                }
            </ul>
            <p><Link className={styles.meal_time} to={"/id/"+userId+"/diet/lunch"}>점심+</Link></p>
            <ul className={styles.diet_list}>
                {lunchs.map((food)=>{
                    
                    return(
                        <li key={food.diet_num}>
                        식품명:{food.food},식품종류:{food.food_type},칼로리:{parseInt(food.kcl)}kcal,단백질:{parseInt(food.protein)}g{""},
                        지방:{parseInt(food.fat)}g,탄수화물:{parseInt(food.carbo)}g,섭취량:{parseInt(food.serving_size)}g<button className={styles.diet_btn} onClick={()=>deleteFood(food.diet_num,food.meal_time)}>삭제</button>
                        </li>
                )})
                }
            </ul>   
            <p><Link className={styles.meal_time} to={"/id/"+userId+"/diet/dinner"}>저녁+</Link></p>
            <ul className={styles.diet_list}>
                {dinners.map((food)=>{
                    
                    return(
                        <li key={food.diet_num}>
                        식품명:{food.food},식품종류:{food.food_type},칼로리:{parseInt(food.kcl)}kcal,단백질:{parseInt(food.protein)}g{""},
                        지방:{parseInt(food.fat)}g,탄수화물:{parseInt(food.carbo)}g,섭취량:{parseInt(food.serving_size)}g<button className={styles.diet_btn} onClick={()=>deleteFood(food.diet_num,food.meal_time)}>삭제</button>
                        </li>
                )})
                }
            </ul>   
        </div>
    );
}

