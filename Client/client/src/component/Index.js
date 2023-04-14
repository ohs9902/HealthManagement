import styles from "../index.module.css"
export default function Index()
{
    return(
        <div className={styles.main}>
            <div className={styles.introduce}>
                <p>건강 관리를 위해 <br></br>식단과 운동을 기록할 수 있는<br></br> api를 구현했습니다.</p>
            </div>
           
        </div>
    )
}