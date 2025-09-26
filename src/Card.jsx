import profilepic from "./assets/aashish.jpg"

function Card(){
    return (
        <div className="card">
            <img  src={profilepic} alt="profile pic"></img>
            <h2>Aashish Adhikari</h2>
            <p>Software Engineer</p>
        </div>
    );
}


export default Card