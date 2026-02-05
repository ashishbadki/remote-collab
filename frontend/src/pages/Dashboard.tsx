// pages/Dashboard.tsx - Complete refined dashboard
import Navbar from "../components/Navbar";
import CreateWorkspace from "../components/CreateWorkspace";
import WorkspaceList from "../components/allWorkspaceList";
import Footer from "../components/Footer";
const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            <header>
                <Navbar />
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                                Welcome back, John!
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 sm:text-base">
                                Pick up where you left off. Select a workspace to continue collaborating with your team.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Join Workspace Banner */}
                <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                            <div className="mb-4 sm:mb-0 sm:mr-6">
                                <h3 className="mb-2 text-xl font-semibold text-white">Join a Workspace</h3>
                                <p className="max-w-md text-indigo-100">
                                    Accept an invitation link to collaborate with existing teams and projects
                                </p>
                            </div>
                            <button className="inline-flex items-center rounded-lg bg-white px-5 py-3 text-sm 
                                             font-semibold text-indigo-600 shadow-sm hover:bg-gray-50">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Join Workspace
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Create Workspace Panel */}
                    <div className="lg:col-span-1">
                        <CreateWorkspace />
                        
                    </div>

                    {/* Workspaces List */}
                    <div className="lg:col-span-2">
                        <WorkspaceList />
                    </div>
                </div>
            </main>

            <footer>
                <Footer/>
            </footer>
        </div>
    );
};

export default Dashboard;