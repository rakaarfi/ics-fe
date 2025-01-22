import fields from "./field"

export const FormTemplate = ({ formData, onChange }) => (
    (
        fields.map((field) => (
            <td className="border border-gray-300 px-1 py-2 min-w-[120px]" key={field.name}>
                {field.type === "text" && (
                    <input
                        type="text"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={onChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                    />
                )}
                {field.type === "tel" && (
                    <input
                        type="tel"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={onChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                    />
                )}
                {field.type === "date" && (
                    <input
                        type="date"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={onChange}
                        className="block w-28 rounded-md bg-white px-1 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                    />
                )}
                {field.type === "select" && (
                    <select
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={onChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                        required
                    >
                        <option value="" disabled>
                            Select
                        </option>
                        {field.options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )}
            </td>
        ))
    )
)

export const FormTemplateInput = ({ formData, onChange }) => (
    (
        fields.map((field) => (
            <td className="border border-gray-300 px-1 py-2 bg-[#e1e5e7] min-w-[120px]" key={field.name}>
                {field.type === "text" && (
                    <input
                        type="text"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={onChange}
                        className="block w-full rounded-md bg-[#e1e5e7] px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                        required
                    />
                )}
                {field.type === "tel" && (
                    <input
                        type="tel"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={onChange}
                        className="block w-full rounded-md bg-[#e1e5e7] px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                        required
                    />
                )}
                {field.type === "date" && (
                    <input
                        type="date"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={onChange}
                        className="block w-28 rounded-md bg-[#e1e5e7] px-1 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                        required={field.name === "join_date"}
                    />
                )}
                {field.type === "select" && (
                    <select
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={onChange}
                        className="block w-full rounded-md bg-[#e1e5e7] px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                        required
                    >
                        <option value="" disabled>
                            Select
                        </option>
                        {field.options.map((option) => (
                            <option key={option} value={option} className="bg-[#e1e5e7]">
                                {option}
                            </option>
                        ))}
                    </select>
                )}
            </td>
        ))
    )
)

