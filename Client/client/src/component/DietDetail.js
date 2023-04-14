import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../diet.module.css";
export default function DietDetail()
{
    const userId = localStorage.getItem('userId');
    const {date} = useParams();     
    const [breakfasts,setBreakfasts] = useState([]);
    const [lunchs,setLunchs] = useState([]);
    const [dinners,setDinners] = useState([]);
    const [totalK,setTotalK] = useState(null);
    const [totalP,setTotalP] = useState(null);
    const [totalF,setTotalF] = useState(null);
    const [totalC,setTotalC] = useState(null);

    useEffect(()=>{
        axios.post('http://localhost:4000/api/diet_detail',{
            id:userId,
            meal_time:"breakfast",
            date:date
        })
        .then((diet)=>{
            setBreakfasts(diet.data);
        })
    },[])

    useEffect(()=>{
        axios.post('http://localhost:4000/api/diet_detail',{
            id:userId,
            meal_time:"lunch",
            date:date
        })
        .then((diet)=>{
            setLunchs(diet.data);
        })
    },[])

    useEffect(()=>{
        axios.post('http://localhost:4000/api/diet_detail',{
            id:userId,
            meal_time:"dinner",
            date:date
        })
        .then((diet)=>{
            setDinners(diet.data);
        })
    },[])

    

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

    return(
        <div>
            <p>{date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1년$2월$3일')}</p>
            <p id={styles.total}>총 섭취 칼로리:{parseInt(totalK)}kcal 단백질:{parseInt(totalP)}g 지방:{parseInt(totalF)}g 탄수화물:{parseInt(totalC)}g </p>
            <p>아침</p>
            {breakfasts.length>0 ?(
                <ul className={styles.diet_list}>
                    {breakfasts.map((diet)=>{
                        return(
                            <li key={diet.diet_num}>
                                식품명:{diet.food},식품종류:{diet.food_type},칼로리:{parseInt(diet.kcl)}kcal,단백질:{parseInt(diet.protein)}g{""},
                            지방:{parseInt(diet.fat)}g,탄수화물:{parseInt(diet.carbo)}g,섭취량:{parseInt(diet.serving_size)}g
                            </li>
                        );
                    })
                    }
                </ul>
            ):(
                <p>기록된 식단이 없습니다.</p>
            )
            }
            <p>점심</p>
            {lunchs.length>0 ?(
                <ul className={styles.diet_list}>
                    
                    {lunchs.map((diet)=>{
                        return(
                            <li key={diet.diet_num}>
                                식품명:{diet.food},식품종류:{diet.food_type},칼로리:{parseInt(diet.kcl)}kcal,단백질:{parseInt(diet.protein)}g{""},
                            지방:{parseInt(diet.fat)}g,탄수화물:{parseInt(diet.carbo)}g,섭취량:{parseInt(diet.serving_size)}g
                            </li>
                        );
                    })
                    }
                </ul>
            ):(
                <p>기록된 식단이 없습니다.</p>
            )
            }
            <p>저녁</p>
            {dinners.length>0 ?(
                <ul className={styles.diet_list}>
                    {dinners.map((diet)=>{
                        return(
                            <li key={diet.diet_num}>    
                                식품명:{diet.food},식품종류:{diet.food_type},칼로리:{parseInt(diet.kcl)}kcal,단백질:{parseInt(diet.protein)}g{""},
                            지방:{parseInt(diet.fat)}g,탄수화물:{parseInt(diet.carbo)}g,섭취량:{parseInt(diet.serving_size)}g
                            </li>
                        );
                    })
                    }
                </ul>
            ):(
                <p>기록된 식단이 없습니다.</p>
            )
            }
        </div>
    );
}