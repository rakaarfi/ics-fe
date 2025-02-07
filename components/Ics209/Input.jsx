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
        is_source_ctrl: false,
        materials_release: "",
        is_material_ctrl: false,
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
            [name]: type === "checkbox" ? checked : value,
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

                        {/* Baris Kedua - Section 3 & 4+5 */}
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
                <table className="table-auto border-collapse w-full">
                    <tbody>
                        {/* Objective(s) */}
                        <tr>
                            <td className="px-4 py-2 font-bold" colSpan={7}>3. Objective(s)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <textarea
                                    name="objectives"
                                    value={formData.objectives}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* Operational Period Command Emphasis */}
                        <tr>
                            <td className="px-4 py-2 font-bold" colSpan={7}>4. Operational Period Command Emphasis</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <textarea
                                    name="command_emphasis"
                                    value={formData.command_emphasis}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* General Situational Awareness */}
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>General Situational Awareness</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <textarea
                                    name="situational_awareness"
                                    value={formData.situational_awareness}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* Site Safety Plan */}
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                5. Site Safety Plan Required? (Yes/No)
                                <input
                                    type="checkbox"
                                    name="is_required"
                                    checked={formData.is_required}
                                    onChange={handleChange}
                                    className="mx-2"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">
                                Approved Site Safety Plan(s) Located at:
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                <input
                                    id="approved-site-input"
                                    type="text"
                                    name="safety_plan_location"
                                    value={formData.safety_plan_location}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    disabled={!formData.is_required}
                                />
                            </td>
                        </tr>

                        {/* Incident Action Plan(s) */}
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                6. Incident Action Plan (the items checked below are included in this Incident Action Plan)
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: "ICS 203", name: "ics_203" },
                                        { label: "ICS 205A", name: "ics_205a" },
                                        { label: "ICS 208", name: "ics_208" },
                                        { label: "ICS 204", name: "ics_204" },
                                        { label: "ICS 206", name: "ics_206" },
                                        { label: "Map/Chart", name: "map_chart" },
                                        { label: "ICS 205", name: "ics_205" },
                                        { label: "ICS 207", name: "ics_207" },
                                        { label: "Weather Forecast/Tides/Currents", name: "weather_tides_currents" },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name={item.name}
                                                checked={formData[item.name]}
                                                onChange={handleChange}
                                                className="mx-2"
                                            />
                                            <label>{item.label}</label>
                                        </div>
                                    ))}
                                </div>
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