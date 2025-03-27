import React, {Suspense} from 'react'
import DashboardPage from "@/app/(main)/dashboard/page";
import {BarLoader} from "react-spinners";

const DashboardLayout = () => {
    return (
        <div>
            <div>
                <h1 className="text-6xl font-bold gradient-title mb-5">Dashboard</h1>
            </div>

            {/* <h1>DashboardPage</h1> */}
            <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea"/>}>
            <DashboardPage/>
            </Suspense>
        </div>
    )
}
export default DashboardLayout
