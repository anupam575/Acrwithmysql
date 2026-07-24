"use client";

import useUsers from "../../components/section/useUsers";
import UIPagination from "../../components/section/ui/pagination";
import ActionDropdown from "../../components/section/ui/ActionDropdown";

import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { useRouter } from "next/navigation";

const Users = () => {
  const router = useRouter();

  const {
    page,
    setPage,
    totalUsers,
    totalPages,
    loading,
    search,
    setSearch,
    filteredUsers,
    handleUpdate,
    handleView,
    handleDelete,
  } = useUsers();

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto max-w-[1440px] space-y-4 sm:space-y-5">
        <header className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 sm:h-14 sm:w-14">
                  <PeopleAltIcon className="!text-2xl !text-white sm:!text-3xl" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                    Officer Administration
                  </p>

                  <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                    Officer Management
                  </h1>

                  <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                    Manage officer records, roles, contact information and account access.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-stretch">
                <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                    Total Officers
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {totalUsers ?? filteredUsers.length}
                  </p>
                </div>

                <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                    Current Page
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {page} of {totalPages || 1}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Administration</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">
              Officer Management
            </span>
          </div>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full lg:max-w-xl">
              <label
                htmlFor="officer-search"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600"
              >
                Search Officer
              </label>

              <div className="relative">
                <SearchIcon className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-xl !text-slate-400" />

                <input
                  id="officer-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by officer name, email, phone or role..."
                  className="h-11 w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/admin/register")}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 sm:w-auto"
            >
              <PersonAddAlt1Icon fontSize="small" />
              Register Officer
            </button>
          </div>
        </section>

        <section className=" rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                  Officer Directory
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  View and manage registered officer accounts.
                </p>
              </div>

              <div className="inline-flex w-fit items-center rounded-md border border-slate-200 bg-white px-3 py-2">
                <span className="text-xs text-slate-500">Showing</span>
                <span className="ml-2 text-sm font-bold text-slate-900">
                  {filteredUsers.length}
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-4 py-12 text-center">
              <div className="h-11 w-11 animate-spin rounded-full border-4 border-blue-100 border-t-blue-800" />
              <p className="mt-4 text-sm font-semibold text-slate-700">
                Loading officer records...
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Please wait while the directory is being prepared.
              </p>
            </div>
          ) : filteredUsers.length ? (
            <>
              <div className="hidden md:block">
                <table className="w-full min-w-[920px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#0b3a6f] text-white">
                      <th className="w-16 border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        #
                      </th>
                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Officer
                      </th>
                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Email
                      </th>
                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Phone
                      </th>
                      <th className="border-r border-white/10 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">
                        Role
                      </th>
                      <th className="w-28 px-4 py-3 text-center text-xs font-bold uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user, i) => (
                      <tr
                        key={user._id}
                        className="border-b border-slate-200 odd:bg-white even:bg-slate-50 hover:bg-blue-50"
                      >
                        <td className="border-r border-slate-200 px-4 py-3 font-semibold text-slate-700">
                          {i + 1}
                        </td>

                        <td className="border-r border-slate-200 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold uppercase text-blue-800">
                              {user.firstName?.charAt(0) || "O"}
                            </div>

                            <p className="min-w-0 truncate font-semibold text-slate-900">
                              {user.firstName || "N/A"}
                            </p>
                          </div>
                        </td>

                        <td className="border-r border-slate-200 px-4 py-3 text-slate-700">
                          <span className="break-all">{user.email || "N/A"}</span>
                        </td>

                        <td className="border-r border-slate-200 px-4 py-3 text-slate-700">
                          {user.phoneNumber || "N/A"}
                        </td>

                        <td className="border-r border-slate-200 px-4 py-3">
                          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                            {user.role?.role_name || "N/A"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <div className="rounded-md border border-slate-200 bg-white p-1 shadow-sm">
                              <ActionDropdown
                                onUpdate={() => handleUpdate(user._id)}
                                onView={() => handleView(user._id)}
                                onDelete={() => handleDelete(user._id)}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-3 md:hidden">
                {filteredUsers.map((user, i) => (
                  <article
                    key={user._id}
                    className="overflow-visible rounded-lg border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold uppercase text-blue-800">
                          {user.firstName?.charAt(0) || "O"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {user.firstName || "N/A"}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            Officer #{i + 1}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-md border border-slate-200 bg-white p-1">
                        <ActionDropdown
                          onUpdate={() => handleUpdate(user._id)}
                          onView={() => handleView(user._id)}
                          onDelete={() => handleDelete(user._id)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 p-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Email
                        </p>
                        <p className="mt-1 break-all text-sm font-medium text-slate-800">
                          {user.email || "N/A"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Phone
                          </p>
                          <p className="mt-1 break-words text-sm font-medium text-slate-800">
                            {user.phoneNumber || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Role
                          </p>
                          <span className="mt-1 inline-flex max-w-full rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800">
                            <span className="truncate">
                              {user.role?.role_name || "N/A"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center px-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <PeopleAltIcon className="!text-3xl !text-slate-400" />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-800">
                No Officers Found
              </h3>

              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                No officer record matches the current search. Try another name,
                email, phone number or role.
              </p>
            </div>
          )}

          {!loading && filteredUsers.length > 0 && (
            <div className="overflow-x-auto border-t border-slate-200 bg-slate-50 px-3 py-4 sm:px-5">
              <div className="flex min-w-max justify-center">
                <UIPagination
                  totalPages={totalPages}
                  page={page}
                  onChange={setPage}
                />
              </div>
            </div>
          )}
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Officer Registration and Account Management • Official Administration Portal
        </footer>
      </div>
    </div>
  );
};

export default Users;