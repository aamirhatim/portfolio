import { Job } from './datatypes'

export const currentWorkDesc = 
    "I'm a software developer \
    primarily researching novel applications that use or enable 5G, edge compute, \
    artificial intelligence and robotics. I've worked with a wide \
    range of robots that include indoor/outdoor AMRs, pallet movers, \
    telepresence AMRs, quadrupeds, arms, drones, educational robots \
    and autonomous vehicles."

export const jobs: Array<Job> = [
    {
        title: "Distinguished Engineer",
        company: "Verizon",
        description: "Research novel robotic applications using 5G, edge compute and AI",
        start: "Nov 2019",
        id: "verizon",
        skills: ["Firebase", "Full stack", "React", "Edge robotics"]
    },
    {
        title: "Robotics Engineer",
        company: "Siemens",
        description: "Autonomous indoor vertical farming, end-effector tooling design, robot arm dexterity research",
        start: "Jul 2018",
        end: "Jul 2019",
        id: "siemens",
        skills: ["CAD", "Python", "Robotic manipulation", "Algorithms"]
    },
    {
        title: "Software Implementation Consultant",
        company: "FAST Enterprises",
        description: "Developing online tax return forms for Washington DC using SQL and Visual Basic",
        start: "Jul 2015",
        end: "Jul 2017",
        id: "fast",
        skills: ["BASIC", "SQL"]
    }
]