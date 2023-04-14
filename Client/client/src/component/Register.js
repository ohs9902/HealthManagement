import {useRef,useEffect,useState } from "react";
import {useNavigate} from "react-router-dom";
import styles from "../register.module.css"

export default function Register()
{
    const idRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordAgainRef = useRef(null);
    const nameRef = useRef(null);
    const genderRef = useRef(null);
    const ageRef = useRef(null);
    const nav = useNavigate();
    
    function onRegister(e){
        e.preventDefault();
        if(passwordRef.current.value!==passwordAgainRef.current.value)
        {
            alert("비밀번호와 재확인 비밀번호가 다릅니다.");
            return 
        }
        console.log(idRef.current.value);
        console.log(passwordRef.current.value);
        console.log(nameRef.current.value);
        fetch('http://localhost:4000/api/register',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"   
        },
        body:JSON.stringify({
            id:idRef.current.value,
            password:passwordRef.current.value,
            name:nameRef.current.value,
            height:0,
            weight:0,
            gender:genderRef.current.value,
            age:ageRef.current.value    
        })
        }).then(res=>{
        if(res.ok){
            alert("회원가입 완료");
            nav('/');
        }else{
            throw new Error('회원가입 실패');
        }
        }).catch((err)=>{
            alert('이미 존재하는 계정입니다.');
            console.log(err);
        })
        }
    
       
    return(
    <div id={styles.register}>
        <form onSubmit={onRegister}>
            <h1 className={styles.regiset_h1}>REGISTER</h1>
            <p>
                <input className={styles.register_input} type="text" placeholder="ID"ref={idRef}/>
            </p>
            <p>
                <input className={styles.register_input} type="password" placeholder="PASSWORD" ref={passwordRef}/>
            </p>
            <p>
                <input className={styles.register_input} type="password" placeholder="AGAIN PASSWORD" ref={passwordAgainRef}/>
            </p>
            <p>
                <input className={styles.register_input}  type="text" placeholder="NAME" ref={nameRef}/>
            </p>
            <p>
                <input className={styles.register_input}  type="number" placeholder="age" ref={ageRef}/>
            </p>
            <p>
                <label>성별</label>
                <select className={styles.register_input} ref={genderRef}>
                    <option value="male">남자</option>
                    <option value="female">여자</option>
                </select>
            </p>
            <p>
                <button className={styles.register_input} type="submit">가입</button>
            </p>
        </form>
            
    </div>
    )
}