// src/components/client-form/index.tsx
import React from "react";
import { mdiEmailOutline, mdiKeyOutline, mdiAccountOutline } from "@mdi/js";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";

import useClientForm from "@/src/hooks/useClientForm";
import { Client } from "@/src/types";

const AdminDashboard: React.FC = () => {
  const {
    clients,
    adminLoginUrl,
    formik,
    deleteClient,
    initiateEdit,
    cancelEdit,
    editingClientId,
  } = useClientForm();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10">
      <div className="w-[300px] md:w-[500px] mb-12">
        <h1 className="text-2xl font-medium text-center mb-6">Your Clients</h1>

        {/* EMPTY STATE */}
        {!clients || clients.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md p-8 text-center">
            <p className="text-gray-500 mb-4">No clients yet</p>
            <p className="text-gray-400 mb-6">
              Add your first client using the form below.
            </p>
          </div>
        ) : (
          <ul className="bg-gray-100 p-4 rounded-md shadow-md space-y-4">
            {clients?.map((client: Client) => (
              <li
                key={client?.clientid ?? client?.email}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {client?.firstname} {client?.lastname}
                  </p>
                  <p className="text-sm text-gray-600">{client?.email}</p>
                  {client?.password != null && client.password !== "" && (
                    <p className="text-sm text-gray-600">
                      Password: {client.password}
                    </p>
                  )}
                </div>

                {/* Actions: Edit and Delete */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => initiateEdit(client)}
                    className="px-3 py-1 border rounded-md text-sm hover:bg-gray-200"
                    aria-label={`Edit ${client.firstname} ${client.lastname}`}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteClient(client)}
                    className="px-3 py-1 border rounded-md text-sm text-red-600 hover:bg-red-50"
                    aria-label={`Delete ${client.firstname} ${client.lastname}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-[300px] md:w-[500px]">
        <h2 className="text-2xl font-medium text-center mb-6">
          {editingClientId ? "Edit Client" : "Add a New Client"}
        </h2>

        {editingClientId && (
          <div className="mb-4 text-center text-sm text-gray-600">
            Editing client: <strong>{editingClientId}</strong>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            preppendIcon={mdiAccountOutline}
            iconSize={0.8}
            label="First Name"
            placeholder="First Name"
            {...formik.getFieldProps("firstname")}
            {...formik.getFieldMeta("firstname")}
          />
          <Input
            preppendIcon={mdiAccountOutline}
            iconSize={0.8}
            label="Last Name"
            placeholder="Last Name"
            {...formik.getFieldProps("lastname")}
            {...formik.getFieldMeta("lastname")}
          />
          <Input
            preppendIcon={mdiEmailOutline}
            iconSize={0.8}
            label="Email"
            placeholder="Email"
            {...formik.getFieldProps("email")}
            {...formik.getFieldMeta("email")}
          />
          <Input
            preppendIcon={mdiKeyOutline}
            iconSize={0.8}
            label="Password"
            type="password"
            placeholder="Password"
            {...formik.getFieldProps("password")}
            {...formik.getFieldMeta("password")}
          />

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-primary hover:bg-primary-light text-white"
              type="submit"
            >
              {editingClientId ? "Update Client" : "Add Client"}
            </Button>

            {editingClientId && (
              <Button
                type="button"
                className="bg-gray-200 text-gray-800"
                onClick={() => cancelEdit()}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {adminLoginUrl && (
        <div className="mt-12 text-center">
          <h2 className="text-xl font-medium mb-4">Admin Login URL</h2>
          <p className="text-blue-500 underline">
            <a href={adminLoginUrl}>{adminLoginUrl}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
