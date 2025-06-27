import { Patent } from "./datatypes"

export const patents: Array<Patent> = [
    {
        id: '20240253',
        title: 'System & Method for Unified Map Alignment and Coordinate Transformation Across Multiple Data Formats',
        description: 'A novel method for linking and managing maps of arbitrary data formats into a common map distribution service',
        status: 'SUBMITTED',
        year: 2024
    },
    {
        id: '20220276',
        title: 'Management of Autonomous Mobile Device Connections',
        description: 'Proactive behavior of wireless connection establishment and logging for AMRs',
        status: 'SUBMITTED',
        year: 2022
    },
    {
        id: '20220076',
        title: 'Systems & Methods for Indoor Positioning of Uncrewed Aerial Vehicles',
        description: 'Indoor localization and navigation of drones that require an outdoor GPS signal',
        status: 'GRANTED',
        year: 2025,
        number: '12243433',
        url: 'https://ppubs.uspto.gov/api/pdf/downloadPdf/12243433?requestToken=eyJzdWIiOiI4N2ZiODY3Ni03YWQ5LTQzZTAtYjczOS1mZjE4OTk4ZjZhMjciLCJ2ZXIiOiI2ZDhjMDZkYS1lNzgxLTRlMzktODAwOS04NWFiNTE4ZDRmODciLCJleHAiOjB9'
    },
    {
        id: '20200482',
        title: 'Systems & Methods for Centralized Control of a Fleet of Robotic Devices',
        description: 'Orchestration of multiple AMRs to complete one or more tasks',
        status: 'SUBMITTED',
        year: 2020
    }
]