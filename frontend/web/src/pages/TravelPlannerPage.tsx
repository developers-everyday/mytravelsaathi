import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { travelService, TravelPlan, TravelExpense } from '../services/TravelService';
import TravelPlanForm from '../components/TravelPlanForm';
import { 
  PlusIcon, 
  MapIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  DocumentIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const TravelPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null);
  const [expenses, setExpenses] = useState<TravelExpense[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'expenses' | 'documents'>('overview');

  useEffect(() => {
    if (user) {
      loadTravelPlans();
    }
  }, [user]);

  const loadTravelPlans = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const plans = await travelService.getUserTravelPlans(user.uid);
      setTravelPlans(plans);
      
      if (plans.length > 0 && !selectedPlan) {
        setSelectedPlan(plans[0]);
        loadPlanExpenses(plans[0].id!);
      }
    } catch (error) {
      console.error('Error loading travel plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlanExpenses = async (planId: string) => {
    try {
      const planExpenses = await travelService.getPlanExpenses(planId);
      setExpenses(planExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const handlePlanSelect = (plan: TravelPlan) => {
    setSelectedPlan(plan);
    loadPlanExpenses(plan.id!);
    setActiveTab('overview');
  };

  const handlePlanCreate = (plan: TravelPlan) => {
    setTravelPlans(prev => [plan, ...prev]);
    setSelectedPlan(plan);
    setShowCreateForm(false);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // const getExpensesByCategory = () => {
  //   const categories = expenses.reduce((acc, expense) => {
  //     acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
  //     return acc;
  //   }, {} as Record<string, number>);
  //   return categories;
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Travel Planner</h1>
          <p className="text-gray-600 mt-2">Plan and manage your travel adventures</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Trip
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <TravelPlanForm
              onSave={handlePlanCreate}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Travel Plans Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">My Trips</h3>
            <div className="space-y-2">
              {travelPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPlan?.id === plan.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <h4 className="font-medium text-gray-900">{plan.title}</h4>
                  <p className="text-sm text-gray-600">{plan.destination}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                    plan.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    plan.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {plan.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedPlan ? (
            <div className="bg-white rounded-lg shadow-md">
              {/* Plan Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.title}</h2>
                    <p className="text-gray-600 mt-1">{selectedPlan.destination}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(selectedPlan.startDate).toLocaleDateString()} - {new Date(selectedPlan.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                        {selectedPlan.budget} {selectedPlan.currency}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    selectedPlan.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    selectedPlan.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedPlan.status}
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
                    { id: 'itinerary', label: 'Itinerary', icon: MapIcon },
                    { id: 'expenses', label: 'Expenses', icon: CurrencyDollarIcon },
                    { id: 'documents', label: 'Documents', icon: DocumentIcon }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Trip Description</h3>
                      <p className="text-gray-700">{selectedPlan.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedPlan.accommodations?.length || 0}</div>
                        <div className="text-sm text-gray-600">Accommodations</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedPlan.transportation?.length || 0}</div>
                        <div className="text-sm text-gray-600">Transportation</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{selectedPlan.activities?.length || 0}</div>
                        <div className="text-sm text-gray-600">Activities</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Budget Summary</h4>
                      <div className="flex justify-between items-center">
                        <span>Total Budget:</span>
                        <span className="font-semibold">{selectedPlan.budget} {selectedPlan.currency}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Expenses:</span>
                        <span className="font-semibold">{getTotalExpenses()} {selectedPlan.currency}</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2 mt-2">
                        <span>Remaining:</span>
                        <span className={`font-semibold ${(selectedPlan.budget - getTotalExpenses()) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedPlan.budget - getTotalExpenses()} {selectedPlan.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Daily Itinerary</h3>
                    {selectedPlan.itinerary && selectedPlan.itinerary.length > 0 ? (
                      <div className="space-y-4">
                        {selectedPlan.itinerary.map((day, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">Day {index + 1}</h4>
                              <span className="text-sm text-gray-500">{new Date(day.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-600 mb-2">{day.location}</p>
                            <div className="text-sm">
                              <p><strong>Activities:</strong> {day.activities.join(', ')}</p>
                              <p><strong>Meals:</strong> {day.meals.join(', ')}</p>
                              {day.notes && <p><strong>Notes:</strong> {day.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MapIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No itinerary planned yet</p>
                        <button className="mt-2 text-blue-600 hover:text-blue-700">
                          Add Day Plan
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'expenses' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Expense Tracking</h3>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add Expense
                      </button>
                    </div>
                    
                    {expenses.length > 0 ? (
                      <div className="space-y-4">
                        {expenses.map((expense) => (
                          <div key={expense.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h4 className="font-medium">{expense.description}</h4>
                              <p className="text-sm text-gray-600">{expense.category} • {expense.location}</p>
                              <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{expense.amount} {expense.currency}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <CurrencyDollarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No expenses recorded yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Travel Documents</h3>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Upload Document
                      </button>
                    </div>
                    
                    {selectedPlan.documents && selectedPlan.documents.length > 0 ? (
                      <div className="space-y-4">
                        {selectedPlan.documents.map((doc) => (
                          <div key={doc.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                              <DocumentIcon className="h-8 w-8 text-gray-400 mr-3" />
                              <div>
                                <h4 className="font-medium">{doc.name}</h4>
                                <p className="text-sm text-gray-600">{doc.type}</p>
                                {doc.expiryDate && (
                                  <p className="text-xs text-gray-500">
                                    Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-700">View</button>
                              <button className="text-red-600 hover:text-red-700">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <DocumentIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No documents uploaded yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MapIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trip selected</h3>
              <p className="text-gray-600 mb-6">Choose a trip from the sidebar or create a new one to get started.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Your First Trip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelPlannerPage;
