import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'

export default function ListBox({ defaultValue, values, handleSetValue }) {
    const [selected, setSelected] = useState(defaultValue);

    return (
        <div className="">
            <Listbox
                value={selected}
                onChange={v => {
                    setSelected(v);
                    handleSetValue(v);
                }}
            >
                <ListboxButton
                    className={clsx(
                        'relative rounded-r-md h-11 w-8 flex items-center justify-center bg-teal-600 hover:bg-teal-700 py-1.5 text-sm/6 text-white',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                >
                    {/* {selected} */}
                    <ChevronDownIcon
                        className="group pointer-events-none size-6 fill-white/60"
                        aria-hidden="true"
                    />
                </ListboxButton>
                <ListboxOptions
                    anchor="bottom end"
                    transition
                    className={clsx(
                        '[--anchor-gap:4px] rounded-md w-[6.5rem] border border-white/5 bg-[#121212] p-1 focus:outline-none z-20',
                        'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                    )}
                >
                    {values.map((person) => (
                        <ListboxOption
                            key={person}
                            value={person}
                            className="group flex cursor-pointer items-center gap-2 rounded-md py-1.5 px-3 select-none data-[focus]:bg-white/10"
                        >
                            <div className="text-sm/6 text-white">{person}</div>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>
        </div>
    )
}
