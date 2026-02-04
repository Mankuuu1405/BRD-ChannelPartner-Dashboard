import { useState, useEffect, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  // Personal Information
  const [contactPerson, setContactPerson] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // Address Information
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  // Business Information
  const [businessName, setBusinessName] = useState("");
  const [cin, setCin] = useState("");
  const [pan, setPan] = useState("");
  const [gstin, setGstin] = useState("");
  const [usersCount, setUsersCount] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [loanProduct, setLoanProduct] = useState([]);
  const [loanProductOptions, setLoanProductOptions] = useState([]);

  // Account Information
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [formErrors, setFormErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("tenants/loan-products/");
        setLoanProductOptions(res.data);
      } catch (err) {
        console.error("Error loading products", err);
      }
    };
    fetchProducts();
  }, []);

  const FieldError = ({ error }) => {
    if (!error) return null;
    return <div className="mt-1 text-sm text-red-600">{error}</div>;
  };

  const validators = {
    contact_person: (v) => {
      if (!v) return "Contact person is required";
      if (v.trim().length < 3) return "Minimum 3 characters required";
      if (!/^[a-zA-Z ]+$/.test(v)) return "Only letters allowed";
      return null;
    },

    mobile_no: (v) => {
      if (!v) return "Mobile number is required";
      if (!/^[6-9]\d{9}$/.test(v)) return "Enter valid 10-digit mobile number";
      return null;
    },

    email: (v) => {
      if (!v) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email format";
      return null;
    },

    address: (v) => {
      if (!v) return "Address is required";
      if (v.trim().length < 10) return "Address too short";
      return null;
    },

    city: (v) => {
      if (!v) return "City is required";
      if (v.trim().length < 2) return "City name too short";
      return null;
    },

    pincode: (v) => {
      if (!v) return "Pincode is required";
      if (!/^\d{6}$/.test(v)) return "Enter valid 6-digit pincode";
      return null;
    },

    state: (v) => {
      if (!v) return "State is required";
      if (v.trim().length < 2) return "State name too short";
      return null;
    },

    country: (v) => {
      if (!v) return "Country is required";
      if (v.trim().length < 2) return "Country name too short";
      return null;
    },

    business_name: (v) => {
      if (!v) return "Business name is required";
      if (v.trim().length < 3) return "Minimum 3 characters required";
      if (!/^[a-zA-Z0-9 .&-]+$/.test(v)) return "Invalid characters used";
      return null;
    },

    cin: (v) => {
      if (!v) return "CIN is required";
      if (!/^[A-Z]{3}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(v))
        return "Invalid CIN format (e.g., ABC1234DEF567890)";
      return null;
    },

    pan: (v) => {
      if (!v) return "PAN is required";
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v))
        return "Invalid PAN format (e.g., ABCDE1234F)";
      return null;
    },

    gstin: (v) => {
      if (!v) return "GSTIN is required";
      if (
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]{1}[0-9A-Z]{1}[0-9]{1}$/.test(v)
      )
        return "Invalid GSTIN format";
      return null;
    },

    users_count: (v) => {
      if (!v) return "Number of users is required";
      if (isNaN(v) || parseInt(v) < 1) return "Enter a valid number of users";
      return null;
    },

    subscription_type: (v) => {
      if (!v) return "Subscription type is required";
      return null;
    },

    loan_product: (v) => {
      if (!v || v.length === 0) return "At least one loan product is required";
      return null;
    },

    password: (v) => {
      if (!v) return "Password is required";
      if (v.length < 8) return "Minimum 8 characters required";
      if (!/[A-Z]/.test(v)) return "At least one uppercase letter required";
      if (!/[a-z]/.test(v)) return "At least one lowercase letter required";
      if (!/\d/.test(v)) return "At least one number required";
      return null;
    },
  };

  const doSignup = async () => {
    console.log("Signup button clicked");

    setGlobalError(null);
    setStatus(null);
    setFormErrors({});
    setIsSubmitting(true);

    const errors = {};

    errors.contact_person = validators.contact_person(contactPerson);
    errors.mobile_no = validators.mobile_no(mobile);
    errors.email = validators.email(email);
    errors.address = validators.address(address);
    errors.city = validators.city(city);
    errors.pincode = validators.pincode(pincode);
    errors.state = validators.state(state);
    errors.country = validators.country(country);
    errors.business_name = validators.business_name(businessName);
    errors.cin = validators.cin(cin);
    errors.pan = validators.pan(pan);
    errors.gstin = validators.gstin(gstin);
    errors.users_count = validators.users_count(usersCount);
    errors.subscription_type = validators.subscription_type(subscriptionType);
    errors.loan_product = validators.loan_product(loanProduct);
    errors.password = validators.password(password);

    if (password !== confirm) {
      errors.confirm = "Passwords do not match";
    }

    // Remove null values
    Object.keys(errors).forEach(
      (key) => errors[key] === null && delete errors[key]
    );

    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Sending signup request...");
      const response = await axiosInstance.post("tenants/signup/", {
        business_name: businessName.trim(),
        email: email.trim().toLowerCase(),
        password,
        mobile_no: mobile,
        address: address.trim(),
        contact_person: contactPerson.trim(),
        loan_product: loanProduct,
        city,
        state,
        country,
        pincode,
        cin: cin.trim(),
        pan: pan.trim(),
        gstin: gstin.trim(),
        users_count: parseInt(usersCount),
        subscription_type: subscriptionType,
      });

      console.log("Signup successful");

      // Store user data in localStorage for verification page
      localStorage.setItem("signup_email", email.trim().toLowerCase());
      localStorage.setItem("signup_mobile", mobile);
      localStorage.setItem(
        "signup_userId",
        response.data.id || response.data.user_id || response.data.tenant_id
      );

      // Show success message before redirecting
      setStatus("Account created successfully! Redirecting to verification...");

      // Redirect to verification page after a short delay
      setTimeout(() => {
        navigate("/verify", {
          state: {
            email: email.trim().toLowerCase(),
            mobile: mobile,
            userId:
              response.data.id ||
              response.data.user_id ||
              response.data.tenant_id,
          },
        });
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        // Handle field-specific errors
        const fieldErrors = {};
        Object.keys(data).forEach((key) => {
          if (Array.isArray(data[key])) {
            fieldErrors[key] = data[key][0];
          } else {
            fieldErrors[key] = data[key];
          }
        });
        setFormErrors(fieldErrors);
      } else {
        setGlobalError(data?.detail || "Signup failed. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axiosInstance.get("locations/countries/");
        setCountriesList(res.data);
      } catch (err) {
        console.error("Error fetching countries", err);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!country) {
      setStatesList([]);
      return;
    }
    const fetchStates = async () => {
      try {
        const res = await axiosInstance.get(
          `locations/states/?country=${country}`
        );
        setStatesList(res.data);
        setState("");
        setCity("");
      } catch (err) {
        console.error("Error fetching states", err);
      }
    };
    fetchStates();
  }, [country]);

  useEffect(() => {
    if (!state) {
      setCitiesList([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const res = await axiosInstance.get(`locations/cities/?state=${state}`);
        setCitiesList(res.data);
        setCity("");
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    };
    fetchCities();
  }, [state]);

  const MultiSelectDropdown = ({
    options,
    selected,
    onChange,
    placeholder,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
      function handleClickOutside(event) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target))
          setIsOpen(false);
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (value) => {
      const newSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      onChange(newSelected);
    };

    return (
      <div className="relative group" ref={wrapperRef}>
        <div
          className="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded-md min-h-[48px] p-2 flex flex-wrap gap-2 items-center cursor-pointer transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected.length === 0 ? (
            <span className="text-gray-400 pl-2 select-none">
              {placeholder}
            </span>
          ) : (
            selected.map((item) => (
              <span
                key={item}
                className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-200 flex items-center gap-1"
              >
                {item}
                <span
                  className="cursor-pointer hover:text-blue-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(item);
                  }}
                >
                  ×
                </span>
              </span>
            ))
          )}
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-xl max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.id || option.name}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                onClick={() => toggleOption(option.name)}
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center ${
                    selected.includes(option.name)
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selected.includes(option.name) && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {option.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-6 shadow-lg rounded-xl sm:rounded-lg sm:px-10">
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
            </div>

            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 text-center">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Join us today and get started with your business journey
            </p>
          </div>

          {/* GLOBAL ERROR */}
          {globalError && (
            <div
              className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
              role="alert"
            >
              {globalError}
            </div>
          )}

          {/* SUCCESS */}
          {status && (
            <div
              className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md"
              role="alert"
            >
              {status}
            </div>
          )}

          <div className="mt-6">
            {/* Personal Information Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
                Personal Information
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                {/* CONTACT PERSON */}
                <div>
                  <label
                    htmlFor="contact_person"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="contact_person"
                      name="contact_person"
                      type="text"
                      placeholder="Owner / Manager Name"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.contact_person ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.contact_person} />
                  </div>
                </div>

                {/* MOBILE NO */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[6-9]{1}[0-9]{9}"
                      placeholder="9876543210"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, ""))
                      }
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.mobile_no ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.mobile_no} />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.email ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.email} />
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      placeholder="Full business address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.address ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.address} />
                  </div>
                </div>

                {/* COUNTRY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      formErrors.country ? "border-red-300" : ""
                    }`}
                  >
                    <option value="">Select Country</option>
                    {countriesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <FieldError error={formErrors.country} />
                </div>

                {/* STATE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={!country || statesList.length === 0}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100 ${
                      formErrors.state ? "border-red-300" : ""
                    }`}
                  >
                    <option value="">Select State</option>
                    {statesList.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <FieldError error={formErrors.state} />
                </div>

                {/* CITY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!state || citiesList.length === 0}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100 ${
                      formErrors.city ? "border-red-300" : ""
                    }`}
                  >
                    <option value="">Select City</option>
                    {citiesList.map((cityItem) => (
                      <option key={cityItem.id} value={cityItem.name}>
                        {cityItem.name}
                      </option>
                    ))}
                  </select>
                  <FieldError error={formErrors.city} />
                </div>

                {/* PINCODE */}
                <div>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      maxLength={6}
                      inputMode="numeric"
                      placeholder="110001"
                      value={pincode}
                      onChange={(e) =>
                        setPincode(e.target.value.replace(/\D/g, ""))
                      }
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.pincode ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.pincode} />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
                Business Information
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                {/* BUSINESS NAME */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="business_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="business_name"
                      name="business_name"
                      type="text"
                      placeholder="e.g. ABC Finance Pvt Ltd"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.business_name ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.business_name} />
                  </div>
                </div>

                {/* LOAN PRODUCT */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="loan_product"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Loan Products <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <MultiSelectDropdown
                      options={loanProductOptions}
                      selected={loanProduct}
                      onChange={(val) => setLoanProduct(val)}
                      placeholder="Select products (e.g. Personal Loan, Micro Loan)"
                    />
                    <FieldError error={formErrors.loan_product} />
                  </div>
                </div>

                {/* CIN */}
                <div>
                  <label
                    htmlFor="cin"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CIN <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="cin"
                      name="cin"
                      type="text"
                      placeholder="Corporate Identification Number"
                      value={cin}
                      onChange={(e) =>
                        setCin(
                          e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                        )
                      }
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.cin ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.cin} />
                  </div>
                </div>

                {/* PAN */}
                <div>
                  <label
                    htmlFor="pan"
                    className="block text-sm font-medium text-gray-700"
                  >
                    PAN <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="pan"
                      name="pan"
                      type="text"
                      placeholder="Permanent Account Number"
                      value={pan}
                      onChange={(e) =>
                        setPan(
                          e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                        )
                      }
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.pan ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.pan} />
                  </div>
                </div>

                {/* GSTIN */}
                <div>
                  <label
                    htmlFor="gstin"
                    className="block text-sm font-medium text-gray-700"
                  >
                    GSTIN <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="gstin"
                      name="gstin"
                      type="text"
                      placeholder="Goods and Services Tax Identification Number"
                      value={gstin}
                      onChange={(e) =>
                        setGstin(
                          e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                        )
                      }
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.gstin ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.gstin} />
                  </div>
                </div>

                {/* USERS COUNT */}
                <div>
                  <label
                    htmlFor="users_count"
                    className="block text-sm font-medium text-gray-700"
                  >
                    No. of Users/Clients <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="users_count"
                      name="users_count"
                      type="number"
                      min="1"
                      placeholder="Estimated number of users"
                      value={usersCount}
                      onChange={(e) => setUsersCount(e.target.value)}
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.users_count ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.users_count} />
                  </div>
                </div>

                {/* SUBSCRIPTION TYPE */}
                <div>
                  <label
                    htmlFor="subscription_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subscription Type <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="subscription_type"
                      name="subscription_type"
                      value={subscriptionType}
                      onChange={(e) => setSubscriptionType(e.target.value)}
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.subscription_type ? "border-red-300" : ""
                      }`}
                    >
                      <option value="">Select subscription type</option>
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                    <FieldError error={formErrors.subscription_type} />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
                Account Information
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.password ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.password} />
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      placeholder="Re-enter password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className={`block w-full border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.confirm ? "border-red-300" : ""
                      }`}
                    />
                    <FieldError error={formErrors.confirm} />
                  </div>
                </div>
              </div>
            </div>

            {/* SIGN UP BUTTON */}
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isSubmitting}
                onClick={doSignup}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>

            {/* LOGIN LINK */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-700">Already have an account? </span>
              <button
                type="button"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>

            {/* Terms and Privacy */}
            <div className="mt-6 text-center text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
