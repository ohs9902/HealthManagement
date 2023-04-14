import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../food.module.css";

export default function Food()
{
    const [searchResults,setSearchResults] = useState([]);
    const nav = useNavigate();
    const {meal_time} = useParams();
    const searchRef = useRef(null);
    const [servingSizes,setServingSizes] = useState({});
    const userId=localStorage.getItem('userId');
    const [today,setToday] = useState('');
    const foodRef = useRef(null);
    useEffect(()=>{
        const timeId = setInterval(()=>{
            setToday(new Date().toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\./g,'-').split(' ').join("").slice(0,-1));
        },1000);
        return (()=> clearInterval(timeId));
    },[]);

    function searchFood(e)
    {
        e.preventDefault();
        axios.post('http://localhost:4000/api/food_search',{
            search:'%'+searchRef.current.value+'%'
        }).then((food)=>{
            setSearchResults(food.data);
        });
        searchRef.current.value ='';
        setSearchResults([]);
    }

    function handlerServingSize(food,e)
    {
        const servingSize = e.target.value===""?(parseInt(food.serving_size)):(parseInt(e.target.value));
        setServingSizes({...servingSizes,[food.food_code]:servingSize});
    }
    
    function inputBreakfast(foodData,serving_size)
    {
        const ratio = serving_size/foodData.serving_size;
        const changeServing ={
            carbo:foodData.carbo*ratio,
            protein:foodData.protein*ratio,
            fat:foodData.fat*ratio,
            kcal:foodData.kcal*ratio
        };
        axios.post('http://localhost:4000/api/food',{
            user_id:userId,
            meal_time:meal_time,
            food:foodData.food_name,
            food_type:foodData.food_type,
            serving_size:serving_size,
            kcl:changeServing.kcal,
            carbo:changeServing.carbo,
            protein:changeServing.protein,   
            fat:changeServing.fat,
            date:today 
        }).then(()=>{
            alert('식사가 등록되었습니다.');
            nav(-1);
        }).catch((err)=>
        {
            console.log(err);
        }
        )
    }
    return(
        <div>
           
            <form id={styles.search} onSubmit={searchFood}>
                <p>{today}</p>
                <label>음식 검색</label>
                <p><input className={styles.search}type="search" ref={searchRef}/><button className={styles.s_btn}>검색</button></p>
            </form>

            {searchResults.length>0 ?(  
                <ul>
                {searchResults.map((food)=>{
                    const basicServing = food.serving_size;
                    return(
                        <li className={styles.food_list} key={food.food_code}>
                            식품명:{food.food_name},식품종류:{food.food_type},칼로리:{food.kcal}kcal,단백질:{food.protein}g,{""},
                            지방:{food.fat}g,탄수화물:{food.carbo}g,제공량:{food.serving_size}g 
                            <input type="number" placeholder="제공량(g)" onChange={(e)=>handlerServingSize(food,e)}/>
                            <button className={styles.f_btn} onClick={()=>{
                                const servingSize = servingSizes[food.food_code];
                                inputBreakfast(food,servingSize);
                            }}>등록</button>
                            <button className={styles.f_btn} onClick={()=>{
                                inputBreakfast(food,basicServing);
                            }}>
                                기본제공량 등록
                            </button>
                        </li>
                    )
                })} 
            </ul>
            ):
            (
             <p className={styles.intro}>음식을 검색하세요.</p>   
            )
            }
            <p><button>새로운 음식 등록</button></p>
        </div>
    );
}