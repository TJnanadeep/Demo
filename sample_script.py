#!/usr/bin/env python3
"""
Sample Python Script for Demo
This script demonstrates common Python programming concepts including:
- Functions
- Classes
- Error handling
- File operations
- Data structures
"""

import sys
import json
from datetime import datetime


class Person:
    """A simple Person class to demonstrate OOP concepts."""
    
    def __init__(self, name, age):
        """Initialize a Person with name and age."""
        self.name = name
        self.age = age
    
    def greet(self):
        """Return a greeting message."""
        return f"Hello, my name is {self.name} and I am {self.age} years old."
    
    def to_dict(self):
        """Convert Person object to dictionary."""
        return {
            "name": self.name,
            "age": self.age
        }


def calculate_sum(numbers):
    """
    Calculate the sum of a list of numbers.
    
    Args:
        numbers (list): List of numbers to sum
        
    Returns:
        float: Sum of all numbers
        
    Raises:
        TypeError: If input is not a list
        ValueError: If list contains non-numeric values
    """
    if not isinstance(numbers, list):
        raise TypeError("Input must be a list")
    
    try:
        return sum(numbers)
    except TypeError:
        raise ValueError("All elements in the list must be numeric")


def calculate_average(numbers):
    """
    Calculate the average of a list of numbers.
    
    Args:
        numbers (list): List of numbers
        
    Returns:
        float: Average of the numbers
    """
    if not numbers:
        return 0
    return calculate_sum(numbers) / len(numbers)


def process_data(data):
    """
    Process a dictionary of data and return formatted results.
    
    Args:
        data (dict): Dictionary containing data to process
        
    Returns:
        dict: Processed results
    """
    results = {
        "timestamp": datetime.now().isoformat(),
        "processed": True,
        "data": data
    }
    return results


def save_to_file(data, filename):
    """
    Save data to a JSON file.
    
    Args:
        data (dict): Data to save
        filename (str): Name of the file
    """
    try:
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Data successfully saved to {filename}")
    except Exception as e:
        print(f"Error saving file: {e}")
        raise


def read_from_file(filename):
    """
    Read data from a JSON file.
    
    Args:
        filename (str): Name of the file to read
        
    Returns:
        dict: Data from the file
    """
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"File {filename} not found")
        return None
    except json.JSONDecodeError:
        print(f"Invalid JSON in file {filename}")
        return None


def main():
    """Main function demonstrating the usage of various functions and classes."""
    print("=" * 50)
    print("Sample Python Script Demo")
    print("=" * 50)
    print()
    
    # Demonstrate Person class
    print("1. Creating Person objects:")
    person1 = Person("Alice", 30)
    person2 = Person("Bob", 25)
    print(f"   {person1.greet()}")
    print(f"   {person2.greet()}")
    print()
    
    # Demonstrate list operations
    print("2. Calculating sum and average:")
    numbers = [10, 20, 30, 40, 50]
    total = calculate_sum(numbers)
    average = calculate_average(numbers)
    print(f"   Numbers: {numbers}")
    print(f"   Sum: {total}")
    print(f"   Average: {average}")
    print()
    
    # Demonstrate data processing
    print("3. Processing data:")
    sample_data = {
        "users": [person1.to_dict(), person2.to_dict()],
        "numbers": numbers,
        "statistics": {
            "sum": total,
            "average": average
        }
    }
    processed = process_data(sample_data)
    print(f"   Data processed at: {processed['timestamp']}")
    print()
    
    # Demonstrate error handling
    print("4. Demonstrating error handling:")
    try:
        calculate_sum("not a list")
    except TypeError as e:
        print(f"   Caught expected error: {e}")
    print()
    
    # Demonstrate file operations
    print("5. File operations:")
    test_filename = "/tmp/sample_output.json"
    save_to_file(processed, test_filename)
    read_data = read_from_file(test_filename)
    if read_data:
        print(f"   Successfully read data from {test_filename}")
    print()
    
    print("=" * 50)
    print("Demo completed successfully!")
    print("=" * 50)
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
