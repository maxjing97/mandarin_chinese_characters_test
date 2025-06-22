import "../App.css"
import { useNavigate } from 'react-router-dom';

//this the main navigation part to select the characters
export default function Characters() {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.text}>
                    Test Your knowledge of chinese characters (字)
                </div>
                <h2>Select Test Type</h2>
                <div style={styles.buttonContainer}>
                    <button onClick={() =>  navigate('/1-3select')} style={styles.button}>Pronunciation without tones</button>
                    <button onClick={() =>  navigate('/1select')} style={styles.button}>Pronunciation without tones</button>
                    <button onClick={() => navigate('/2select') } style={styles.button}>Definitions</button>
                </div>

                <p>1/3 s time recommended for a challenge</p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderBottom: '4px solid #444',
        height: "500px"
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: '32px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        border: '1px solid #333',
        borderRadius: '4px',
        backgroundColor: '#eee',
    }
};