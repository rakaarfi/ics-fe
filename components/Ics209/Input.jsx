'use client';

import dynamic from 'next/dynamic';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import axios from 'axios';
import { ButtonSubmit } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { set } from 'date-fns';
import { Truculenta } from 'next/font/google';

const TimePicker = dynamic(
    () => import('@mui/x-date-pickers').then((mod) => mod.TimePicker),
    { ssr: false }
);

export default function Input() {
    const [formData, setFormData] = useState({
        operational_period_id: "",
        report_version: "",
        report_number: "",
        incident_commander_id: null,
        incident_source: "",
        is_source_ctrl: true,
        materials_release: "",
        is_material_ctrl: true,
        response_status: "",
        is_acc: false,
        acc_num: null,
        is_acc_mustered: false,
        is_acc_sheltered: false,
        is_acc_evacuated: false,
        is_unacc: false,
        unacc_num: null,
        unacc_emp: null,
        unacc_con: null,
        unacc_oth: null,
        is_injured: false,
        inj_num: null,
        inj_emp: null,
        inj_con: null,
        inj_oth: null,
        is_dead: false,
        dead_num: null,
        dead_emp: null,
        dead_con: null,
        dead_oth: null,
        env_impact: "",
        env_desc: "",
        comm_impact: "",
        comm_desc: "",
        ops_impact: "",
        ops_desc: "",
        events_period: "",
        obj_next_period: "",
        actions_next_period: "",
        res_needed: "",
        est_completion_date: "",
        est_res_democ_start: "",
        cost_to_date: null,
        final_cost_est: null,
        gov_contact: "",
        media_contact: "",
        kin_contact: "",
        shareholder_contact: "",
        comm_rep_contact: "",
        ngo_contact: "",
        is_prepared: false,
        situation_unit_leader_id: "",
        date_prepared: "",
        time_prepared: "",
    });
    const [incidentData, setIncidentData] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [SULeaderData, setSULeaderData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleIncidentChange = (e) => {
        const incident_id = parseInt(e.target.value, 10);
        if (!incident_id) return;

        const incident = incidentData.find((item) => item.id === incident_id);
        setSelectedIncident(incident);

        console.log("Selected Incident:", incident);


        setLoading(true);
        setError(null);
        setOperationalPeriodData([]);
        setFormData((prevState) => ({
            ...prevState,
            incident_id,
            operational_period_id: "",
        }));

        axios.get(`http://127.0.0.1:8000/operational-period/read-by-incident/${incident_id}`)
            .then((response) => {
                setOperationalPeriodData(response.data);
            })
            .catch(() => setError('Failed to fetch operational period data'))
            .finally(() => setLoading(false));
    };


    const handleOperationalPeriodChange = (e) => {
        const operational_period_id = parseInt(e.target.value, 10);
        const operational_period = operationalPeriodData.find((item) => item.id === operational_period_id);
        setSelectedPeriod(operational_period);
        setFormData(prevState => ({
            ...prevState,
            operational_period_id
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox"
                ? checked
                : name === "is_source_ctrl" || name === "is_material_ctrl"
                    ? value === "true"
                    : value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validasi data sebelum mengirim
            if (!formData.operational_period_id) {
                alert("Please select an Operational Period.");
                return;
            }
            if (!formData.incident_commander_id || !formData.situation_unit_leader_id) {
                alert('Please fill in all required fields.');
                return;
            }

            const mainPayload = {
                operational_period_id: formData.operational_period_id,
                report_version: formData.report_version,
                report_number: formData.report_number,
                incident_commander_id: formData.incident_commander_id,
                incident_source: formData.incident_source,
                is_source_ctrl: formData.is_source_ctrl,
                materials_release: formData.materials_release,
                is_material_ctrl: formData.is_material_ctrl,
                response_status: formData.response_status,
                is_acc: formData.is_acc,
                acc_num: formData.acc_num,
                is_acc_mustered: formData.is_acc_mustered,
                is_acc_sheltered: formData.is_acc_sheltered,
                is_acc_evacuated: formData.is_acc_evacuated,
                is_unacc: formData.is_unacc,
                unacc_num: formData.unacc_num,
                unacc_emp: formData.unacc_emp,
                unacc_con: formData.unacc_con,
                unacc_oth: formData.unacc_oth,
                is_injured: formData.is_injured,
                inj_num: formData.inj_num,
                inj_emp: formData.inj_emp,
                inj_con: formData.inj_con,
                inj_oth: formData.inj_oth,
                is_dead: formData.is_dead,
                dead_num: formData.dead_num,
                dead_emp: formData.dead_emp,
                dead_con: formData.dead_con,
                dead_oth: formData.dead_oth,
                env_impact: formData.env_impact,
                env_desc: formData.env_desc,
                comm_impact: formData.comm_impact,
                comm_desc: formData.comm_desc,
                ops_impact: formData.ops_impact,
                ops_desc: formData.ops_desc,
                events_period: formData.events_period,
                obj_next_period: formData.obj_next_period,
                actions_next_period: formData.actions_next_period,
                res_needed: formData.res_needed,
                est_completion_date: formData.est_completion_date,
                est_res_democ_start: formData.est_res_democ_start,
                cost_to_date: formData.cost_to_date,
                final_cost_est: formData.final_cost_est,
                gov_contact: formData.gov_contact,
                media_contact: formData.media_contact,
                kin_contact: formData.kin_contact,
                shareholder_contact: formData.shareholder_contact,
                comm_rep_contact: formData.comm_rep_contact,
                ngo_contact: formData.ngo_contact,
            };
            const response = await axios.post('http://127.0.0.1:8000/ics-209/main/create', mainPayload);
            const ics_209_id = response.data.id;

            const now = dayjs();
            const preparedPayload = {
                ics_209_id: ics_209_id,
                situation_unit_leader_id: formData.situation_unit_leader_id,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
                is_prepared: formData.is_prepared,
            };
            await axios.post('http://127.0.0.1:8000/ics-209/preparation/create/', preparedPayload);

            alert('Data submitted successfully!');
        } catch (error) {
            console.error('Error submitting data:', error);
            alert(`Failed to submit data: ${error.response?.data?.message || error.message}`);
        }
    };

    const fetchIncidentData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/incident-data/read');
            setIncidentData(response.data);
        } catch (error) {
            console.error('Error fetching incident data:', error);
            setError('Failed to fetch incident data');
        }
    };

    useEffect(() => {
        fetchIncidentData();
    }, []);

    const fetchSULeader = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/planning-section/situation-unit-leader/read/');
            setSULeaderData(response.data);
            console.log("Situation Unit Leader Data:", response.data);
        } catch (error) {
            console.error('Error fetching Situation Unit Leader data:', error);
            setError('Failed to fetch Situation Unit Leader data');
        }
    };

    useEffect(() => {
        fetchSULeader();
    }, []);

    const parseTimeIncident = (timeStr) => {
        if (!timeStr) return null;

        if (timeStr.includes(':')) {
            const today = dayjs().format('YYYY-MM-DD');
            return dayjs(`${today} ${timeStr}`).format('HH:mm');
        }
        return null;
    };

    return (
        <FormContainer title="Input ICS 209 - Incident Objectives">
            <div className="mb-4 flex flex-row">
                <select
                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                    value={formData.incident_id || ""}
                    onChange={handleIncidentChange}
                    required
                >
                    <option value="" disabled>
                        Select Incident
                    </option>
                    {incidentData.map((incident) => (
                        <option key={incident.id} value={incident.id}>
                            {incident.name}
                        </option>
                    ))}
                </select>

                <select
                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                    value={formData.operational_period_id || ""}
                    onChange={handleOperationalPeriodChange}
                    disabled={loading || !formData.incident_id}
                    required
                >
                    <option value="" disabled>
                        {loading ? 'Loading...' : 'Select Operational Period'}
                    </option>
                    {operationalPeriodData.map((period) => (
                        <option key={period.id} value={period.id}>
                            {period.date_from} - {period.date_to}
                        </option>
                    ))}
                </select>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {formData.incident_id && formData.operational_period_id && (
                <table className="table-fixed border-collapse w-full">
                    <tbody>
                        {/* Baris Pertama - Section 1 & 2 */}
                        <tr>
                            {/* Incident Name */}
                            <td className='px-4 py-2 border rounded-md'>
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                1. Incident Name
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                {selectedIncident.name}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            {/* Incident No */}
                            <td className="px-4 py-2 border rounded-md" >
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                2. Incident No
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                {selectedIncident.no}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        {/* Baris Kedua - Section 3 & 4+5 */}
                        <tr>
                            {/* Location of Incident */}
                            <td className='px-4 py-2 border rounded-md'>
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                3. Location of Incident
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                {selectedIncident.location}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            {/* Date/Time + Time Zone */}
                            <td className="px-4 py-2 border rounded-md" >
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300" colSpan={2}>
                                                4. Date & Time of Incident
                                            </td>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300" >
                                                5. Time Zone
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                {selectedIncident.date_incident}
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">
                                                {parseTimeIncident(selectedIncident.time_incident) || '-'}
                                            </td>
                                            <td className="px-4 py-2 border rounded-md" >
                                                {selectedIncident.timezone}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        {/* Baris Ketiga - Section 6 dan 7 */}
                        <tr>
                            {/* Location of Incident */}
                            <td className='px-4 py-2 border rounded-md'>
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                6. Brief Description of Incident
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                {selectedIncident.description}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            {/* Operational Period */}
                            <td className="px-4 py-2 border rounded-md" >
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300" colSpan={4}>
                                                7. Operational Period
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">Date From:</td>
                                            <td className="px-4 py-2 border rounded-md">{selectedPeriod.date_from}</td>
                                            <td className="px-4 py-2 border rounded-md">Date To:</td>
                                            <td className="px-4 py-2 border rounded-md">{selectedPeriod.date_to}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">Time From:</td>
                                            <td className="px-4 py-2 border rounded-md">{selectedPeriod.time_from}</td>
                                            <td className="px-4 py-2 border rounded-md">Time To:</td>
                                            <td className="px-4 py-2 border rounded-md">{selectedPeriod.time_to}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
            <form onSubmit={handleSubmit}>
                <table className="table-fixed border-collapse w-full my-5">
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border rounded-md w-1/3" >
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                Report Version
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <div className="flex space-x-4">
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="report_version"
                                                            value="Initial"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.report_version === "Initial"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Initial</span>
                                                    </label>

                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="report_version"
                                                            value="Update"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.report_version === "Update"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Update</span>
                                                    </label>

                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="report_version"
                                                            value="Final"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.report_version === "Final"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Final</span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            <td className="px-4 py-2 border rounded-md  w-1/3" >
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                Report Number
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.report_number} onChange={handleChange} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            <td className="px-4 py-2 border rounded-md  w-1/3" >
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                Incident Commander
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.incident_commander_id} onChange={handleChange} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 border rounded-md" colSpan={2}>
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                Source of Incident
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.incident_source} onChange={handleChange} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            <td className="px-4 py-2 border rounded-md" >
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                Controlled/Uncontrolled
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <div className="flex space-x-4">
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="is_source_ctrl"
                                                            value="true"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.is_source_ctrl === true}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Controlled</span>
                                                    </label>

                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="is_source_ctrl"
                                                            value="false"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.is_source_ctrl === false}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Uncontrolled</span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 border rounded-md" colSpan={2}>
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                Materials Release
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.materials_release} onChange={handleChange} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            <td className="px-4 py-2 border rounded-md" >
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                Controlled/Uncontrolled
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <div className="flex space-x-4">
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="is_material_ctrl"
                                                            value="true"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.is_material_ctrl === true}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Controlled</span>
                                                    </label>

                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="is_material_ctrl"
                                                            value="false"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.is_material_ctrl === false}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Uncontrolled</span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                Status Response
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.response_status} onChange={handleChange} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Impact to Personnel */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300" colSpan={10}>
                                                Impact to Personnel
                                            </td>
                                        </tr>

                                        {/* Accounted For */}
                                        <tr>
                                            {/* <td className="px-4 py-2 border rounded-md">Accounted for</td> */}
                                            <td className="px-4 py-2 border rounded-md whitespace-nowrap">
                                                <input type="checkbox" className="mr-2" checked={formData.is_acc} onChange={handleChange} />
                                                <strong>Accounted for</strong>
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Number</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.acc_num} onChange={handleChange} />
                                            </td>
                                            <td className="px-4 py-2 border rounded-md text-center" colSpan={2}>
                                                <input type="checkbox" className="mr-2" checked={formData.is_acc_mustered} onChange={handleChange} />
                                                Mustered
                                            </td>
                                            <td className="px-4 py-2 border rounded-md text-center" colSpan={2}>
                                                <input type="checkbox" className="mr-2" checked={formData.is_acc_sheltered} onChange={handleChange} />
                                                Sheltered
                                            </td>
                                            <td className="px-4 py-2 border rounded-md text-center" colSpan={2}>
                                                <input type="checkbox" className="mr-2" checked={formData.is_acc_evacuated} onChange={handleChange} />
                                                Evacuated
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>

                                            </td>
                                        </tr>

                                        {/* Unaccounted For */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md whitespace-nowrap">
                                                <input type="checkbox" className="mr-2" checked={formData.is_unacc} onChange={handleChange} />
                                                <strong>Unaccounted for</strong>
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Number</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.unacc_num} onChange={handleChange} />
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Employee</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.unacc_emp} onChange={handleChange} />
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Contractor</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.unacc_con} onChange={handleChange} />
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Other</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.unacc_oth} onChange={handleChange} />
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>

                                            </td>
                                        </tr>

                                        {/* Injured */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="checkbox" className="mr-2" checked={formData.is_injured} onChange={handleChange} />
                                                <strong>Injured</strong>
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Number</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.inj_num} onChange={handleChange} />
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Employee</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.inj_emp} onChange={handleChange} />
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Contractor</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.inj_con} onChange={handleChange} />
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Other</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.inj_oth} onChange={handleChange} />
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>

                                            </td>
                                        </tr>

                                        {/* Dead */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="checkbox" className="mr-2" checked={formData.is_dead} onChange={handleChange} />
                                                <strong>Dead</strong>
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Number</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.dead_num} onChange={handleChange} />
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Employee</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.dead_emp} onChange={handleChange} />
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Contractor</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.dead_con} onChange={handleChange} />
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">Other</td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input type="text" className="w-full text-center border rounded-md" value={formData.dead_oth} onChange={handleChange} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Impact on Env */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Impact on Environment</strong>
                                                <div className="flex space-x-4 ml-32">
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="env_impact"
                                                            value="None"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.env_impact === "None"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>None</span>
                                                    </label>

                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="env_impact"
                                                            value="Minor"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.env_impact === "Minor"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Minor</span>
                                                    </label>

                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="env_impact"
                                                            value="Major"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.env_impact === "Major"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Major</span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-100" colSpan={10}>
                                                Description Impact on Environment
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="env_desc"
                                                    value={formData.env_desc}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Impact on Community */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Impact on Community</strong>
                                                <div className="flex space-x-4 ml-32">
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="comm_impact"
                                                            value="None"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.comm_impact === "None"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>None</span>
                                                    </label>

                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="comm_impact"
                                                            value="Minor"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.comm_impact === "Minor"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Minor</span>
                                                    </label>

                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="comm_impact"
                                                            value="Major"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.comm_impact === "Major"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Major</span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-100" colSpan={10}>
                                                Description Impact on Community
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="comm_desc"
                                                    value={formData.comm_desc}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Impact on Operations */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Impact on Operations</strong>
                                                <div className="flex space-x-4 ml-32">
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="ops_impact"
                                                            value="None"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.ops_impact === "None"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>None</span>
                                                    </label>

                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="ops_impact"
                                                            value="Minor"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.ops_impact === "Minor"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Minor</span>
                                                    </label>

                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="ops_impact"
                                                            value="Major"
                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            checked={formData.ops_impact === "Major"}
                                                            onChange={handleChange}
                                                        />
                                                        <span>Major</span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-100" colSpan={10}>
                                                Description Impact on Operations
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="ops_desc"
                                                    value={formData.ops_desc}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Significant Event for the Time Period Reported */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Significant Event for the Time Period Reported</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="ops_desc"
                                                    value={formData.events_period}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Incident Objectives for Next Operational Period */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Incident Objectives for Next Operational Period</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="ops_desc"
                                                    value={formData.obj_next_period}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Planned Action for Next Operational Period */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Planned Action for Next Operational Period</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="ops_desc"
                                                    value={formData.actions_next_period}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Significant Resources Needed */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Significant Resources Needed</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="ops_desc"
                                                    value={formData.res_needed}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 border rounded-md w-1/2" colSpan={2}>
                                <table className="w-full table-fixed">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                <strong>Anticipated Incident Management Completion Date</strong>
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input
                                                    type="date"
                                                    className="w-full text-center border rounded-md"
                                                    value={formData.est_completion_date}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            <td className="px-4 py-2 border rounded-md w-1/2">
                                <table className="w-full table-fixed">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                <strong>Estimated Incident Costs to Date</strong>
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input
                                                    type="text"
                                                    className="w-full text-center border rounded-md"
                                                    value={formData.cost_to_date}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2 border rounded-md w-1/2" colSpan={2}>
                                <table className="w-full table-fixed">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                <strong>Projected Significant Resource Demobilization Start Date</strong>
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input
                                                    type="date"
                                                    className="w-full text-center border rounded-md"
                                                    value={formData.est_res_democ_start}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            <td className="px-4 py-2 border rounded-md w-1/2">
                                <table className="w-full table-fixed">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                <strong>Projected Final Incident Cost Estimate</strong>
                                            </td>
                                            <td className="px-4 py-2 border rounded-md">
                                                <input
                                                    type="text"
                                                    className="w-full text-center border rounded-md"
                                                    value={formData.final_cost_est}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Contact with/from Government Agencies */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Contact with/from Government Agencies</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="ops_desc"
                                                    value={formData.gov_contact}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Contact with/from Media */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Contact with/from Media</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="ops_desc"
                                                    value={formData.media_contact}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Contact with/from Next-of-Kin */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Contact with/from Next-of-Kin</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="ops_desc"
                                                    value={formData.kin_contact}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Contact with/from Shareholders */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Contact with/from Shareholders</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="ops_desc"
                                                    value={formData.shareholder_contact}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            {/* Contact with/from NGOs */}
                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                <table className="w-full">
                                    <tbody>
                                        {/* Header */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                <strong>Contact with/from NGOs</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md">
                                                <textarea
                                                    name="ops_desc"
                                                    value={formData.ngo_contact}
                                                    rows="7"
                                                    cols="50"
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                </textarea>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        {/* Prepared by */}
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                7. Prepared by:
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">
                                <select
                                    name="situation_unit_leader_id"
                                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                    value={formData.situation_unit_leader_id || ""}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        situation_unit_leader_id: e.target.value
                                    }))}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Situation Unit Leader
                                    </option>
                                    {SULeaderData.map(leader => (
                                        <option key={leader.id} value={leader.id}>
                                            {leader.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="checkbox"
                                    name="is_prepared"
                                    checked={formData.is_prepared || false}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        is_prepared: e.target.checked
                                    }))}
                                    className="mr-2"
                                    required
                                />
                                Signature
                            </td>
                        </tr>

                        {/* Submit Button */}
                        <tr>
                            <td colSpan={7} className="text-right px-4 py-2">
                                <ButtonSubmit />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </FormContainer>
    );
}