"use client"; // Ensures this component runs on the client side

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CountdownTimer() {
  const [duration, setDuration] = useState<number | string>(""); // Duration input state
  const [timeLeft, setTimeLeft] = useState<number>(0); // State to track remaining time
  const [isActive, setIsActive] = useState<boolean>(false); // Tracks if the timer is active
  const [isPaused, setIsPaused] = useState<boolean>(false); // Tracks if the timer is paused
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold the timer ID

  // Function to set the duration and initialize timer settings
  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Function to start the timer
  const handleStart = () => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  // Function to pause the timer
  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Function to reset the timer
  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Effect to manage the countdown interval
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);

  // Function to format time into MM:SS format
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Function to handle input change for the duration
  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center bg-[url('https://images.pond5.com/countdown-timer-modern-blue-background-footage-055277158_iconl.jpeg')]">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">Countdown Timer</h1>
        <div className="mb-4">
          <Input
            type="number"
            placeholder="Enter duration in seconds"
            value={typeof duration === "number" ? duration : ""}
            onChange={handleDurationChange}
            className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4 text-center">
          <p className="text-4xl font-mono">{formatTime(timeLeft)}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleSetDuration}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Set Duration
          </Button>
          <Button
            onClick={handleStart}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Start
          </Button>
          <Button
            onClick={handlePause}
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
