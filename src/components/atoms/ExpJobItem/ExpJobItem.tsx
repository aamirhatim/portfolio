import { Job } from '../../../data/datatypes'
import './ExpJobItem.style.scss'

function ExpJobItem(props: {job: Job}) {
    return (
        <div className='exp-job-item'>
           <div className='job-title'>{props.job.title} <span className='job-company'>@{props.job.company}</span></div>
           <div className='job-description'>{props.job.description}</div>
        </div> 
    )
}

export default ExpJobItem