
const About = () => {
  return (
    <div className="max-w-3xl mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About GigFlow</h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        GigFlow is a marketplace designed to connect talented freelancers with clients 
        who need work done. Whether you are a developer, designer, or writer, 
        GigFlow provides a secure and easy platform to manage your projects.
      </p>

      <div className="bg-green-50 p-8 rounded-lg border border-green-100 mb-10">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Our Mission</h2>
        <p className="text-gray-700">
          To simplify the hiring process and empower individuals to build their careers 
          from anywhere in the world.
        </p>
      </div>

      <div className="text-left bg-white p-8 shadow-md rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-2"><strong>Email:</strong> support@gigflow.com</p>
        <p className="mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
        <p><strong>Address:</strong> 123 Tech Street, Silicon Valley, CA</p>
      </div>
    </div>
  );
};

export default About;