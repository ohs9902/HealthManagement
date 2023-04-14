import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts'
import styles from "../weightchange.module.css"
export default function WeightChange()
{
    const [weights,setWeights] = useState(null);

    const userId = localStorage.getItem('userId');
    const userWeight = localStorage.getItem('weight');
    useEffect(()=>{
        axios.post('http://localhost:4000/api/weight_list',{
            id:userId
        })
        .then((weightList)=>{
            setWeights(weightList.data);
        })
    },[])

    if(weights){
        const data = weights.map((weight)=> weight.weight);
        const dates = weights.map((weight)=> weight.date);
    

        const series= [{
            name: "체중",
            data: data
        }];

        const options= {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
            enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: '체중변화 그래프',
            align: 'left'
        },
        grid: {
            row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
            },
        },
        xaxis: {
            categories: dates,
        }

        };

        return (
            <div id={styles.wc}>
                <p className={styles.wc_element}>체중변화</p>
                <ReactApexChart options={options} series={series} type="line" height={350} />
                <p className={styles.wc_element}>현제체중:{userWeight}kg</p>
            </div>
        
        );
        }else{
            <div>looding...</div>
        }
}
