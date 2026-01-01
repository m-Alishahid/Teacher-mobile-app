import {
  AttendanceRecord,
  attendanceHistory as initialAttendanceHistory,
  currentAttendance as initialCurrentAttendance,
} from "@/data";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface AttendanceContextType {
  currentAttendance: AttendanceRecord;
  attendanceHistory: AttendanceRecord[];
  isLoading: boolean;
  isCheckedIn: boolean;
  checkIn: () => void;
  checkOut: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentAttendance, setCurrentAttendance] = useState<AttendanceRecord>(
    initialCurrentAttendance
  );
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >(initialAttendanceHistory);
  const [isLoading, setIsLoading] = useState(false);

  const isCheckedIn = currentAttendance.status === "checked-in";

  const checkIn = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const now = new Date();
      const checkInTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newRecord = {
        ...currentAttendance,
        checkInTime,
        status: "checked-in" as const, // consistently typed
      };

      setCurrentAttendance(newRecord);
      setIsLoading(false);
    }, 1000);
  };

  const checkOut = () => {
    performCheckOut();
  };

  const performCheckOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      const now = new Date();
      const checkOutTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Calculate working hours (simplified logic)
      const workingHours = "8h 15m";

      const completedRecord: AttendanceRecord = {
        ...currentAttendance,
        checkOutTime,
        workingHours,
        status: "present",
      };

      // Add to history
      setAttendanceHistory((prev) => [completedRecord, ...prev]);

      // Update current state
      setCurrentAttendance(completedRecord);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AttendanceContext.Provider
      value={{
        currentAttendance,
        attendanceHistory,
        isLoading,
        isCheckedIn,
        checkIn,
        checkOut,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
