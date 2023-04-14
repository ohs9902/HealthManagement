import { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import styles from "../head.module.css";

export default function Head(){
    const userId = localStorage.getItem('userId');
    const nav = useNavigate();
    function logOut()
    {
        localStorage.removeItem('userId');
        nav('/');
    }
    function login()
    {
        nav(`/login`);
    }
    function register()
    {
        nav(`/register`);
    }

    if(userId!=null){
        return (
            <div className={styles.head}>
                <div className="">
                    <h1><Link className={styles.home} to= {"id/"+userId}>🍽 Health Managemnet</Link></h1>
                    <button className={styles.log}onClick={logOut}>로그아웃</button>
                </div>
            </div>
        )
    }else{
        return (
            <div className={styles.head}>
                <div className="">
                    <h1><Link className={styles.home} to="/">🍽 Health Managemnet</Link></h1>
                    <button className={styles.log} onClick={login}>로그인</button>
                    <button className={styles.log} onClick={register}>회원가입</button>
                    
                </div>
                
            </div>
        )
    }
    
}