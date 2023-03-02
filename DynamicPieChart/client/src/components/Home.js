import React,{useState,useEffect} from 'react';
import axios from'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
    const URL = "http://localhost:8080/api/items/get-item/";
    const [data,setData]=useState([]);
    const [label,setLabel]=useState([]);
    const [backgroundColor,setBackgroundColor] = useState([]);
    const [hoverColor,setHoverColor] = useState([]);

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      const setPieChartData = async()=>{
        try{
            let res = await axios.get(URL);
            let capacity = res.data.capacity;
            let items = res.data.items;
            
            let labelArr = items.map(item => item.name);
            setLabel([...labelArr,"Remaining"]);
    
            const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
            const remainingQuantity = capacity - totalQuantity;
            let dataArr = items.map(item=>item.quantity);
            setData([...dataArr,remainingQuantity]);        
    
            const remainingQuantityColor = '#f2f2f2';//whity
            let bgColorArr = items.map(item => getRandomColor());
            setBackgroundColor([...bgColorArr,remainingQuantityColor]);

            let hoverColorArr = items.map(item=> "#66ff99");
            setHoverColor([...hoverColorArr,remainingQuantityColor]);
          }
          catch(err){
            console.log(err);
          }
      }

    useEffect(()=>{
        setPieChartData();
    },[]);

    const piChartData = {
        labels: label,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColor,
            hoverBackgroundColor: hoverColor,
          },
        ],
      };

      const options = {
        title: {
          display: true,
          text: 'My Product Chart',
          fontFamily: 'Arial',
          fontSize: 18,
        },
        legend: {
          labels: {
            fontFamily: 'Helvetica',
            fontSize: 14,
          },
        },
      };
      

  return (
    <div style={{ width: '300px', height: '300px' }}>
       <Pie data={piChartData} options={options} />
    </div>
  )
}

export default Home