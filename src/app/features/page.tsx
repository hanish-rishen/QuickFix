import Link from 'next/link';

const ProjectsServicesSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Home Repairs
          </h3>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Plumbing repairs & installations
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Electrical work & lighting
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Carpentry & furniture repair
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Wall & ceiling repairs
            </li>
          </ul>
          <Link href="/home-repairs" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Learn More
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Appliance Repairs
          </h3>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Refrigerator & freezer repairs
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Washing machine services
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              AC & heating system maintenance
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Kitchen appliance fixes
            </li>
          </ul>
          <Link href="/appliance-repairs" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Learn More
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Mobile & Gadget Repairs
          </h3>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Screen replacements
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Battery replacements
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Water damage repairs
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Software troubleshooting
            </li>
          </ul>
          <Link href="/gadget-repairs" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Learn More
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Home Cleaning & Maintenance
          </h3>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Deep cleaning services
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Carpet & upholstery cleaning
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Window & facade cleaning
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Garden maintenance
            </li>
          </ul>
          <Link href="/home-cleaning" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Learn More
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Locksmith & Security
          </h3>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Lock installation & repair
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Key cutting & duplication
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Security system setup
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Emergency lockout service
            </li>
          </ul>
          <Link href="/security-services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Learn More
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg -mt-6 -mx-6 mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            IT & Networking Services
          </h3>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400 mb-4">
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Network setup & troubleshooting
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              PC & laptop repairs
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Data recovery services
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Smart home setup
            </li>
          </ul>
          <Link href="/it-services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsServicesSection;
