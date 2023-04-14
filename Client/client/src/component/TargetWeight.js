import axios from "axios";
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";

export default function TargetWeight()
{
    
    const userId = localStorage.getItem('userId');
    const targetRef = useRef(null);
    const nav =useNavigate();
    function target_change(e)
    {    
        e.preventDefault();
        
        axios.post('http://localhost:4000/api/target_weight',{
            id:userId,
            target_weight:targetRef.current.value
        })
        .catch((err)=>{
            console.err('에러:',err)
        })
        alert('목표체중 등록');
        nav(`/id/${userId}`);
    }

    return (
        <div>
            <form onSubmit={target_change}>
                <input type="number" placeholder="목표체중" ref={targetRef}/>
                <button>저장</button>
            </form>
        </div>
    )
}