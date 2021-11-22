import React from 'react';
import { Bar } from 'react-chartjs-2';

function RenderChart({policyList, region}) {

  const data = {
    labels: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    datasets: [{
      label: 'No. of Policies',
      data: policyList,
      backgroundColor: [
        'rgba(255,127,0,0.5)',
        'rgba(255,0,0,0.5)',
        'rgba(255,255,0,0.5)',
        'rgba(186,0,255,0.5)',
        'rgba(255,70,0,0.5)',
        'rgba(254,179,0,0.5)',
        'rgba(0,174,174,0.5)',
        'rgba(115,8,165,0.5)',
        'rgba(204,0,175,0.5)',
        'rgba(0,121,0,0.5)',
        'rgba(0,255,0,0.5)',
        'rgba(0,0,255,0.5)',
      ],
      borderColor: [
        'rgba(255,127,0,1)',
        'rgba(255,0,0,1)',
        'rgba(255,255,0,1)',
        'rgba(186,0,255,1)',
        'rgba(255,70,0,1)',
        'rgba(254,179,0,1)',
        'rgba(0,174,174,1)',
        'rgba(115,8,165,1)',
        'rgba(204,0,175,1)',
        'rgba(0,121,0,1)',
        'rgba(0,255,0,1)',
        'rgba(0,0,255,1)',
      ],
      borderWidth: 1
    }]
  }

  return (
    <>
      <div className='bar-div'>
        <Bar width='1200px' height='530px' data={data} />
      </div>
      <center><div className='mt-2'>Monthly data of No. of policies sold in {region} region</div></center>
    </>
  )
}

export default RenderChart
