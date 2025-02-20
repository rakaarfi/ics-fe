'use client';

import axios from 'axios';
import { ButtonSaveChanges } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';

export default function Detail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [actionType, setActionType] = useState(null); // "edit" atau "create"
    const [formData, setFormData] = useState({
        operational_period_id: "",
        report_version: "",
        report_number: "",
        incident_commander_id: "",
        incident_source: "",
        is_source_ctrl: true,
        materials_release: "",
        is_material_ctrl: true,
        response_status: "",
        is_acc: false,
        acc_num: 0,
        is_acc_mustered: false,
        is_acc_sheltered: false,
        is_acc_evacuated: false,
        is_unacc: false,
        unacc_num: 0,
        unacc_emp: 0,
        unacc_con: 0,
        unacc_oth: 0,
        is_injured: false,
        inj_num: 0,
        inj_emp: 0,
        inj_con: 0,
        inj_oth: 0,
        is_dead: false,
        dead_num: 0,
        dead_emp: 0,
        dead_con: 0,
        dead_oth: 0,
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
        cost_to_date: "",
        final_cost_est: "",
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
    const [fetchedIncident, setFetchedIncident] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [fetchedPeriod, setFetchedPeriod] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [SULeaderData, setSULeaderData] = useState([]);
    const [ICData, setICData] = useState([]);
    const [preparationData, setPreparationData] = useState({
        is_prepared: false,
        situation_unit_leader_id: "",
        date_prepared: "",
        time_prepared: "",
    })
    const [preparationID, setPreparationID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = document.location.hostname;
    const apiUrl = `http://${hostName}:8000/api/`;
    const routeUrl = "ics-209/main";

    useEffect(() => {
        setActionType(null); // Reset pilihan saat pertama kali masuk
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        let operationalPeriodId = null;

        // Ambil data detail
        axios
            .get(`${apiUrl}${routeUrl}/read/${id}`)
            .then((response) => {
                setData(response.data);
                setFormData(response.data);
                operationalPeriodId = response.data.operational_period_id;

                return axios.get(`${apiUrl}operational-period/read`);
            })
            .then((response) => {
                setOperationalPeriodData(response.data);

                const selectedOperationalPeriod = response.data.find(
                    (period) => period.id === operationalPeriodId
                );
                setFetchedPeriod(selectedOperationalPeriod);

                if (selectedOperationalPeriod) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        incident_id: selectedOperationalPeriod.incident_id,
                    }));
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
            })
            .finally(() => {
                setLoading(false);
            });

        if (id) {
            axios.get(`${apiUrl}ics-209/preparation/read-by-ics-209-id/${id}`)
                .then((response) => {
                    setPreparationData(response.data[0]);
                    setPreparationID(response.data[0].id);
                })
                .catch((error) => {
                    console.error('Error fetching Preparation data:', error);
                    setError('Failed to fetch Preparation data');
                });
        }

    }, [id]);


    const handleIncidentChange = (e) => {
        const incident_id = parseInt(e.target.value, 10);
        if (!incident_id) return;

        const incident = incidentData.find((item) => item.id === incident_id);
        setSelectedIncident(incident);

        setLoading(true);
        setError(null);
        setOperationalPeriodData([]);
        setFormData((prevState) => ({
            ...prevState,
            incident_id,
            operational_period_id: "",
        }));

        axios.get(`${apiUrl}operational-period/read-by-incident/${incident_id}`)
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

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === "checkbox"
                ? checked
                : (name === "is_source_ctrl" || name === "is_material_ctrl")
                    ? value === "true"
                    : value,
        }));
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
                acc_num: parseInt(formData.acc_num, 10),
                is_acc_mustered: formData.is_acc_mustered,
                is_acc_sheltered: formData.is_acc_sheltered,
                is_acc_evacuated: formData.is_acc_evacuated,
                is_unacc: formData.is_unacc,
                unacc_num: parseInt(formData.unacc_num, 10),
                unacc_emp: parseInt(formData.unacc_emp, 10),
                unacc_con: parseInt(formData.unacc_con, 10),
                unacc_oth: parseInt(formData.unacc_oth, 10),
                is_injured: formData.is_injured,
                inj_num: parseInt(formData.inj_num, 10),
                inj_emp: parseInt(formData.inj_emp, 10),
                inj_con: parseInt(formData.inj_con, 10),
                inj_oth: parseInt(formData.inj_oth, 10),
                is_dead: formData.is_dead,
                dead_num: parseInt(formData.dead_num, 10),
                dead_emp: parseInt(formData.dead_emp, 10),
                dead_con: parseInt(formData.dead_con, 10),
                dead_oth: parseInt(formData.dead_oth, 10),
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

            // Pilih API
            const response = actionType === "edit"
                ? await axios.put(`${apiUrl}ics-209/main/update`, mainPayload) // Edit existing report
                : await axios.post(`${apiUrl}ics-209/main/create`, mainPayload); // Create new report

            const ics_209_id = response.data.id;

            const now = dayjs();
            const preparedPayload = {
                ics_209_id: ics_209_id,
                situation_unit_leader_id: formData.situation_unit_leader_id,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
                is_prepared: formData.is_prepared,
            };
            if (preparationID) {
                await axios.put(`${apiUrl}ics-209/preparation/update/${preparationID}`, preparedPayload);
            } else {
                await axios.post(`${apiUrl}ics-209/preparation/create`, preparedPayload);
            }
            alert("Changes saved successfully!");
        } catch (error) {
            console.error('Error submitting data:', error);
            alert(`Failed to submit data: ${error.response?.data?.message || error.message}`);
        }
    };

    const fetchIncidentData = async () => {
        try {
            const response = await axios.get(`${apiUrl}incident-data/read`);
            setIncidentData(response.data);

            const selectedIncident = response.data.find(
                (item) => item.id === fetchedPeriod?.incident_id
            );
            setFetchedIncident(selectedIncident);

        } catch (error) {
            console.error('Error fetching incident data:', error);
            setError('Failed to fetch incident data');
        }
    };

    useEffect(() => {
        if (fetchedPeriod) {
            fetchIncidentData();
        }
    }, [fetchedPeriod]);

    useEffect(() => {
        fetchIncidentData();
    }, []);

    const fetchSULeader = async () => {
        try {
            const response = await axios.get(`${apiUrl}planning-section/situation-unit-leader/read/`);
            setSULeaderData(response.data);
        } catch (error) {
            console.error('Error fetching Situation Unit Leader data:', error);
            setError('Failed to fetch Situation Unit Leader data');
        }
    };

    useEffect(() => {
        fetchSULeader();
    }, []);

    const fetchIC = async () => {
        try {
            const response = await axios.get(`${apiUrl}main-section/incident-commander/read/`);
            setICData(response.data);
        } catch (error) {
            console.error('Error fetching Incident Commander data:', error);
            setError('Failed to fetch Incident Commander data');
        }
    };

    useEffect(() => {
        fetchIC();
    }, []);

    const parseTimeIncident = (timeStr) => {
        if (!timeStr) return null;

        if (timeStr.includes(':')) {
            const today = dayjs().format('YYYY-MM-DD');
            return dayjs(`${today} ${timeStr}`).format('HH:mm');
        }
        return null;
    };

    // Update nilai _num secara otomatis
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            unacc_num: (parseInt(prev.unacc_emp) || 0) + (parseInt(prev.unacc_con) || 0) + (parseInt(prev.unacc_oth) || 0),
            inj_num: (parseInt(prev.inj_emp) || 0) + (parseInt(prev.inj_con) || 0) + (parseInt(prev.inj_oth) || 0),
            dead_num: (parseInt(prev.dead_emp) || 0) + (parseInt(prev.dead_con) || 0) + (parseInt(prev.dead_oth) || 0),
        }));
    }, [formData.unacc_emp, formData.unacc_con, formData.unacc_oth, formData.inj_emp, formData.inj_con, formData.inj_oth, formData.dead_emp, formData.dead_con, formData.dead_oth]);

    // Fungsi untuk memformat angka menjadi format currency (Rp 12,000)
    const formatCurrency = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
            .format(value)
            .replace("Rp", "Rp ")
            .trim();
    };

    // Fungsi untuk menghandle perubahan input agar tidak terjadi bug angka 0 tambahan
    const handleCurrencyChange = (e) => {
        const { name, value } = e.target;

        // Hapus semua karakter non-angka
        const rawValue = value.replace(/[^0-9]/g, "");

        // Cegah angka kosong berubah menjadi "0"
        const newValue = rawValue === "" ? "" : parseInt(rawValue, 10);

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue, // Simpan sebagai angka tanpa format
        }));
    };

    return (
        <FormContainer title="ICS 209 - Incident Status Summary">
            {/* Modal Dialog untuk Memilih Aksi */}
            {actionType === null && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between gap-3">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={() => setActionType("edit")}
                            >
                                Update an 
                                <br />
                                existing report
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                onClick={() => setActionType("create")}
                            >
                                Create a new version
                                <br />
                                based on a previous one
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {actionType !== null && (
                <>
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
                                                        {selectedIncident?.name || fetchedIncident?.name}
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
                                                        {selectedIncident?.no || fetchedIncident?.no}
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
                                                        {selectedIncident?.location || fetchedIncident?.location}
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
                                                        {selectedIncident?.date_incident || fetchedIncident?.date_incident}
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        {parseTimeIncident(selectedIncident?.time_incident) || parseTimeIncident(fetchedIncident?.time_incident) || '-'}
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md" >
                                                        {selectedIncident?.timezone || fetchedIncident?.timezone}
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
                                                        {selectedIncident?.description || fetchedIncident?.description}
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
                                                    <td className="px-4 py-2 border rounded-md">{selectedPeriod?.date_from || fetchedPeriod.date_from}</td>
                                                    <td className="px-4 py-2 border rounded-md">Date To:</td>
                                                    <td className="px-4 py-2 border rounded-md">{selectedPeriod?.date_to || fetchedPeriod.date_to}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md">Time From:</td>
                                                    <td className="px-4 py-2 border rounded-md">{selectedPeriod?.time_from || fetchedPeriod.time_from}</td>
                                                    <td className="px-4 py-2 border rounded-md">Time To:</td>
                                                    <td className="px-4 py-2 border rounded-md">{selectedPeriod?.time_to || fetchedPeriod.time_to}</td>
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
                                                        <input
                                                            type="text"
                                                            name='report_number'
                                                            className="w-full text-center border rounded-md"
                                                            value={formData.report_number}
                                                            onChange={handleChange}
                                                        />
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
                                                        <select
                                                            name="incident_commander_id"
                                                            className="flex-1 block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                                            value={formData.incident_commander_id || ""}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                incident_commander_id: e.target.value
                                                            }))}
                                                            required
                                                        >
                                                            <option value="" disabled>
                                                                Select Incident Commander
                                                            </option>
                                                            {ICData.map(commander => (
                                                                <option key={commander.id} value={commander.id}>
                                                                    {commander.name}
                                                                </option>
                                                            ))}
                                                        </select>
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
                                                        <input
                                                            type="text"
                                                            name='incident_source'
                                                            className="w-full text-center border rounded-md"
                                                            value={formData.incident_source}
                                                            onChange={handleChange}
                                                        />
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
                                                        <input
                                                            type="text"
                                                            name='materials_release'
                                                            className="w-full text-center border rounded-md"
                                                            value={formData.materials_release}
                                                            onChange={handleChange}
                                                        />
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
                                                        <input
                                                            type="text"
                                                            name='response_status'
                                                            className="w-full text-center border rounded-md"
                                                            value={formData.response_status}
                                                            onChange={handleChange}
                                                        />
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
                                                    <td className="px-4 py-2 border rounded-md whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            name='is_acc'
                                                            className="mr-2"
                                                            checked={formData.is_acc || false}
                                                            onChange={handleChange} />
                                                        <strong>Accounted for</strong>
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Number</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="number"
                                                            name='acc_num'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.acc_num, 10)}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md text-center" colSpan={2}>
                                                        <input
                                                            type="checkbox"
                                                            name='is_acc_mustered'
                                                            className="mr-2"
                                                            checked={formData.is_acc_mustered || false}
                                                            onChange={handleChange}
                                                        />
                                                        Mustered
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md text-center" colSpan={2}>
                                                        <input
                                                            type="checkbox"
                                                            name='is_acc_sheltered'
                                                            className="mr-2"
                                                            checked={formData.is_acc_sheltered || false}
                                                            onChange={handleChange}
                                                        />
                                                        Sheltered
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md text-center" colSpan={2}>
                                                        <input
                                                            type="checkbox"
                                                            name='is_acc_evacuated'
                                                            className="mr-2"
                                                            checked={formData.is_acc_evacuated || false}
                                                            onChange={handleChange}
                                                        />
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
                                                        <input
                                                            type="checkbox"
                                                            name='is_unacc'
                                                            className="mr-2"
                                                            checked={formData.is_unacc || false}
                                                            onChange={handleChange} />
                                                        <strong>Unaccounted for</strong>
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Number</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="text"
                                                            min="0"
                                                            name='unacc_num'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.unacc_num, 10) || 0}
                                                            onChange={handleChange}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Employee</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            name='unacc_emp'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.unacc_emp, 10) || 0}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Contractor</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            name='unacc_con'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.unacc_con, 10) || 0}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Other</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            name='unacc_oth'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.unacc_oth, 10) || 0}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>

                                                    </td>
                                                </tr>

                                                {/* Injured */}
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="checkbox"
                                                            name='is_injured'
                                                            className="mr-2"
                                                            checked={formData.is_injured || false}
                                                            onChange={handleChange}
                                                        />
                                                        <strong>Injured</strong>
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Number</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="text"
                                                            name='inj_num'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.inj_num, 10) || 0}
                                                            onChange={handleChange}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Employee</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            name='inj_emp'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.inj_emp, 10) || 0}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Contractor</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            name='inj_con'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.inj_con, 10) || 0}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Other</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            name='inj_oth'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.inj_oth, 10) || 0}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>

                                                    </td>
                                                </tr>

                                                {/* Dead */}
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="checkbox"
                                                            name='is_dead'
                                                            className="mr-2"
                                                            checked={formData.is_dead}
                                                            onChange={handleChange}
                                                        />
                                                        <strong>Dead</strong>
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Number</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="text"
                                                            name='dead_num'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.dead_num, 10) || 0}
                                                            onChange={handleChange}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Employee</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            name='dead_emp'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.dead_emp, 10) || 0}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Contractor</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            name='dead_con'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.dead_con, 10) || 0}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">Other</td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            name='dead_oth'
                                                            className="w-full text-center border rounded-md"
                                                            value={parseInt(formData.dead_oth, 10) || 0}
                                                            onChange={handleChange}
                                                        />
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
                                                            name="events_period"
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
                                                            name="obj_next_period"
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
                                                            name="actions_next_period"
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
                                                            name="res_needed"
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

                                {/* Anticipated Incident Management Completion Date */}
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
                                                            name="est_completion_date"
                                                            className="w-full text-center border rounded-md"
                                                            value={formData.est_completion_date}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    {/* Estimated Incident Costs to Date */}
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
                                                            name="cost_to_date"
                                                            className="w-full text-center border rounded-md"
                                                            value={formatCurrency(formData.cost_to_date)}
                                                            onChange={handleCurrencyChange}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                {/* Projected Significant Resource Demobilization Start Date */}
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
                                                            name="est_res_democ_start"
                                                            className="w-full text-center border rounded-md"
                                                            value={formData.est_res_democ_start}
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    {/* Projected Final Incident Cost Estimate */}
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
                                                            name='final_cost_est'
                                                            className="w-full text-center border rounded-md"
                                                            value={formatCurrency(formData.final_cost_est)}
                                                            onChange={handleCurrencyChange}
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
                                                            name="gov_contact"
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
                                                            name="media_contact"
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
                                                            name="kin_contact"
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
                                                            name="shareholder_contact"
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
                                                            name="ngo_contact"
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
                                            value={preparationData.situation_unit_leader_id || ""}
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
                                            checked={preparationData.is_prepared || false}
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
                                        <ButtonSaveChanges />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </>
            )}
        </FormContainer>
    );
}