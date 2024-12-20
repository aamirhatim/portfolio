import { Patent } from "./datatypes"

export const patents: Array<Patent> = [
    {
        id: '20240253',
        title: 'System & Method for Unified Map Alignment and Coordinate Transformation Across Multiple Data Formats',
        description: 'A novel method for linking and managing maps of arbitrary data formats into a common map distribution service',
        status: 'FILED'
    },
    {
        id: '20220276',
        title: 'Management of Autonomous Mobile Device Connections',
        description: 'Proactive behavior of wireless connection establishment and logging for AMRs',
        status: 'PUBLISHED'
    },
    {
        id: '20220076',
        title: 'Systems & Methods for Indoor Positioning of Uncrewed Aerial Vehicles',
        description: 'Indoor localization and navigation of drones that require an outdoor GPS signal',
        status: 'PUBLISHED'
    },
    {
        id: '20200482',
        title: 'Systems & Methods for Centralized Control of a Fleet of Robotic Devices',
        description: 'Orchestration of multiple AMRs to complete one or more tasks',
        status: 'PUBLISHED'
    }
]