"use client"
import MainLayout from '@/components/MainLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import { handleApiError } from '@/lib/utils'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface DashboardStats {
  tasks: {
    total: number;
    done: number;
    in_progress: number;
    todo: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    archived: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await axios.get('/task/stats');
        console.log(res.data);
        setStats(res.data);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <MainLayout><div>Loading dashboard...</div></MainLayout>;
  if (error) return <MainLayout><div>{error}</div></MainLayout>;
  if (!stats) return <MainLayout><div>No data available</div></MainLayout>;

  // Chart data for tasks
  const taskChartData = {
    labels: ['Done', 'In Progress', 'Todo'],
    datasets: [
      {
        label: 'Tasks',
        data: [stats.tasks.done, stats.tasks.in_progress, stats.tasks.todo],
        backgroundColor: [
          '#10b981', // green for done
          '#f59e0b', // amber for in progress
          '#ef4444'  // red for todo
        ],
        borderWidth: 1
      }
    ]
  }

  // Chart data for projects
  const projectChartData = {
    labels: ['Active', 'Completed', 'Archived'],
    datasets: [
      {
        label: 'Projects',
        data: [stats.projects.active, stats.projects.completed, stats.projects.archived],
        backgroundColor: [
          '#3b82f6', // blue for active
          '#10b981', // green for completed
          '#64748b'  // slate for archived
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <MainLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Task Summary Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.tasks.total}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.tasks.done}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {stats.tasks.in_progress}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Todo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.tasks.todo}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        {/* Task Distribution Chart */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar
                data={taskChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top'
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Project Status Chart */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie
                data={projectChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top'
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}