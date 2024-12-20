import './Experience.style.scss'
import ExpEduItem from '../../atoms/ExpEduItem/ExpEduItem'
import { jobs } from '../../../data/jobs'
import ExpJobItem from '../../atoms/ExpJobItem/ExpJobItem'
import ExpPatentItem from '../../atoms/ExpPatentItem/ExpPatentItem'
import { Education, Job, Patent } from '../../../data/datatypes'
import { educationList } from '../../../data/education'
import { patents } from '../../../data/patentList'

const currentWork = "I'm a software developer \
                    primarily researching novel applications that use or enable 5G, edge compute, \
                    artificial intelligence and robotics. I've worked with a wide \
                    range of robots that include indoor/outdoor AMRs, pallet movers, \
                    telepresence AMRs, quadrupeds, arms, drones, educational robots \
                    and autonomous vehicles."

function Experience() {

    function createJobItem(job:Job) {
        const key = 'job-' + job.id
        return <ExpJobItem key={key} job={job} />
    }

    function createEduItem(edu:Education) {
        const key = 'edu-' + edu.id
        return <ExpEduItem key={key} item={edu} />
    }

    function createPatentItem(patent:Patent) {
        const key = 'patent-' + patent.id
        return <ExpPatentItem key={key} item={patent} />
    }

    return (
        <div id='experience' className='content'>
            <div id='current-work'>
                <div className='exp-title'>Current Work - {jobs[0].title} <span className='job-company'>@{jobs[0].company}</span></div>
                <div id='current-work-txt'>{currentWork}</div>
            </div>

            <div id='prev-work'>
                <div className='exp-title'>Previous Roles</div>
                <div id='exp-job-box'>
                    {jobs.slice(1).map( (j) => createJobItem(j) )}
                </div>
            </div>

            <div id='patents'>
                <div className='exp-title'>Patents</div>
                <div id='exp-patent-box'>
                    {patents.map( (p) => createPatentItem(p) )}
                </div>
            </div>

            <div id='exp-edu-box'>
                <div className='exp-title'>Education</div>
                <div id='exp-edu'>
                    {educationList.map( (edu) => createEduItem(edu) )}
                </div>
            </div>
        </div>
    )
}

export default Experience