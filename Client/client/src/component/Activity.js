import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Activity() {
    const userId = localStorage.getItem('userId');
    const [myInfo,setMyInfo] = useState([]);
    const nav = useNavigate();
    const [activity,setActivity] = useState(null);
    useEffect(()=>{
        axios.post('http://localhost:4000/api/myInfo',{
            id:userId
        })
        .then((info)=>{
            setMyInfo(info.data);
            
        });
    },[]);

    async function calcActivity(e)
    {
        try{
            e.preventDefault();
            const activity_kcal = myInfo.basal*parseFloat(activity);
            await axios.post('http://localhost:4000/api/activity',{
            id:userId,
            activity:parseInt(activity_kcal)
            });
            await alert('활동량 설정이 완료 되었습니다.');
            if(myInfo.target_weight===null)
                await nav(`/id/${userId}/target_weight`)
            else
                await nav(`/id/${userId}`);
        }catch(err){
            console.err("error:",err);
        }
        }

    return (
        <div>
            <h1>평소 활동량을 선택하세요.</h1>
            <form onSubmit={calcActivity}>
                <p>
                    <label>
                        활동량이 거의 없다(좌식생활을 하고 운동을 안함)<br/>
                        <input type="radio" value="1.2" name="activity" onChange={(e)=>setActivity(e.target.value)}/>
                    </label>
                </p>
                <p>
                    <label>
                        활동량이 조금 있다(활동량이 보통이거나 주 1~3회 운동)<br/>
                        <input type="radio" value="1.375" name="activity" onChange={(e)=>setActivity(e.target.value)}/>
                    </label>
                </p>
                <p>
                    <label>
                        활동량이 보통 이다(활동량이 다소 많거나 주3~5회 운동)<br/>
                        <input type="radio" value="1.55" name="activity" onChange={(e)=>setActivity(e.target.value)}/>
                    </label>
                </p>
                <p>
                    <label>
                        활동량이 보통이상 이다(활동량이 많거나 주6~7회 운동)<br/>
                        <input type="radio" value="1.725" name="activity" onChange={(e)=>setActivity(e.target.value)}/>
                    </label>
                </p>
                <p>
                    <label>
                        활동량이 아주 많다(활동량이 매우 많거나 거의 매일 하루2번 운동)<br/>    
                        <input type="radio" value="1.9" name="activity" onChange={(e)=>setActivity(e.target.value)}/>
                    </label>
                </p>
                
                <p>
                    <input type="submit" value="저장" />
                </p>
            </form>
        </div>
    );
}