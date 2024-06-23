import './SkillSection.style.scss'

function SkillSection( { desc } : { desc:string } ) {
    return (
        <div className='skill-section'>
            <h4>{desc}</h4>
        </div>
    )
}

export default SkillSection