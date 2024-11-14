import { ProjectType } from "./datatypes"

const projects: Array<ProjectType> = [
    {
        id: 'autonomus-vehicle',
        title: 'Building an AV (almost) From Scratch',
        subtitle: 'R&D @Verizon',
        skills: ['ROS 2', 'Autoware', 'CAN bus', 'Python', 'LiDAR', 'Sensor Fusion', 'Lanelet2'],
        description: 'Rebuilding a scrapped Lincoln MKZ autonomous vehicle from the ground up using the Autoware nav stack'
    },
    {
        id: 'telesight',
        title: 'TeleSight',
        subtitle: 'R&D @Verizon',
        skills: ['ROS', 'Python', 'Docker', 'React', 'Websockets', 'MQTT', 'Web Design', '5G'],
        description: 'A vendor-agnostic platform that leverages edge compute and mmWave technology to offload robot controls and coordination'
    },
    {
        id: 'teleops',
        title: '5G Teleoperation',
        subtitle: 'R&D @Verizon',
        skills: ['ROS', 'Gstreamer', '5G', 'React'],
        description: 'Using 5G mmWave to develop one of the first vehicle teleoperation applications in the US using 5G mmWave technology',
        video: 'https://www.linkedin.com/posts/anand-j-shah_forwardtogether-teleoperations-ugcPost-6780833171589218305-wSvS?utm_source=share&utm_medium=member_desktop'
    },
    {
        id: 'omni',
        title: "The Omni Project",
        subtitle: "MSR final project (2018)",
        video: "https://www.youtube.com/watch?v=xSkom9F3TOs&ab_channel=AamirHusain",
        skills: ["ROS", "Python", "C++", "Mechatronics", "Multi-agent control", "Circuit Design"],
        description: "Simultaneous operation of three omni-directional robots used for mapping the environment and manipulating large objects"
    },
    {
        id: 'argo',
        title: "Argo",
        subtitle: "MSR winter project (2018)",
        video: "https://www.youtube.com/watch?v=L7owzQ5A6ZQ&ab_channel=AamirHusain",
        code: "https://github.com/aamirhatim/argo",
        skills: ["ROS", "Python", "PID Control", "Motor Control", "Mechatronics", "Computer Vision", "HRI"],
        description: "An autonomous differential drive suitcase that uses AR tags to track and follow objects in its environment"
    },
    {
        id: 'day-zero',
        title: "Day Zero Predictor",
        subtitle: "EECS349 Final (2018)",
        code: "https://github.com/aamirhatim/day_zero_predictor/tree/master/project_data",
        skills: ["PANDAS", "Python", "Weka", "Machine Learning", "Data Analytics"],
        description: "Using machine learning to predict when a country will reach Day Zero - the time when its water supply is fully depleted"
    },
    {
        id: 'inspector-baxter',
        title: "Inspector Baxter",
        subtitle: "ME495 final (2017)",
        code: "https://github.com/aamirhatim/InspectorBaxter",
        video: "https://www.youtube.com/watch?v=Mkh_P828sVU&ab_channel=AamirHusain",
        skills: ["ROS", "Python", "C++", "Point Clouds", "Computer Vision", "Coordinate Trasforms"],
        description: "An introductory ROS project that uses Rethink Robotics' Baxter to manipulate objects via speech commands"
    },
    {
        id: 'techtiles',
        title: "Techtiles",
        subtitle: "Capstone senior design (2015)",
        video: "https://www.youtube.com/watch?v=g21bp58Fbyo&ab_channel=AamirHusain",
        skills: ["Arduino", "CAD", "PCB Design", "C/C++", "PSPICE", "Ultiboard", "Digital Signal Processing", "Filters", "Biometrics"],
        description: "A washable, biometric shirt that measures heart rate, breathing rate, steps, distance, and energy - all sent to a mobile display"
    },
    {
        id: 'portfolio',
        title: "aamirhatim.com",
        subtitle: "Ongoing project",
        code: "https://github.com/aamirhatim/aamirhatim.github.io",
        skills: ["HTML", "CSS", "Javascript", "React" ,"Web Design", "Graphic Desgin", "HMI", "Adobe Illustrator"],
        description: "The current version of this site was made from scratch (and love) using the React framework"
    },
    {
        id: 'motor-controller',
        title: "Motor Controller",
        subtitle: "ME333 final (2018)",
        code: "https://github.com/aamirhatim/motor_controller",
        skills: ["C", "PID Control", "Circuit Design", "SPI", "UART", "MATLAB", "Mechatronics", "DC Motors", "Feedback Control"],
        description: "A closed-loop PID DC motor controller with a MATLAB user interface for low level control"
    },
    {
        id: 'neural-net',
        title: "Designing a Neural Network",
        subtitle: "EECS495 (2018)",
        code: "https://github.com/aamirhatim/deep_learning",
        skills: ["Python", "CNN", "RNN", "Regression", "Neural Networks", "Machine Learning", "Backpropagation"],
        description: "Learning how to build a library from scratch to implement different kinds of neural networks"
    },
    {
        id: 'path-planning',
        title: "Path Planning",
        subtitle: "MSR Orientation (2017)",
        code: "https://github.com/aamirhatim/rrt",
        skills: ["Python", "Vector Geometry", "Data Structure", "Algorithms", "Path Planning", "Machine Learning", "Artificial Intelligence"],
        description: "Using RRTs to explore spaces and avoid collisions from a bitmap image and from randomly generated circles"
    }
]

export default projects