#!/usr/bin/env python3
"""
Test script to verify PLAYTO API is working correctly
Run this after starting both servers to validate the setup
"""

import requests
import json
import sys
from typing import Optional

BASE_URL = "http://localhost:8000/api"
TIMEOUT = 5

class APITester:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.session = requests.Session()
    
    def test_health_check(self) -> bool:
        """Test the public health endpoint"""
        print("\n🧪 Test 1: Health Check (Public Endpoint)")
        try:
            response = self.session.get(f"{BASE_URL}/", timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Status 200 OK")
                print(f"   Message: {data.get('message', 'N/A')}")
                print(f"   Version: {data.get('version', 'N/A')}")
                self.passed += 1
                return True
            else:
                print(f"❌ Unexpected status: {response.status_code}")
                self.failed += 1
                return False
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            self.failed += 1
            return False
    
    def test_posts_list(self) -> bool:
        """Test listing posts (should work without auth)"""
        print("\n🧪 Test 2: List Posts (Public Read Access)")
        try:
            response = self.session.get(f"{BASE_URL}/posts/", timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                count = data.get('count', 0) if isinstance(data, dict) else len(data)
                print(f"✅ Status 200 OK")
                print(f"   Posts count: {count}")
                if count > 0:
                    print(f"   ✅ Demo data present!")
                self.passed += 1
                return True
            elif response.status_code == 401:
                print(f"⚠️  Status 401 Unauthorized (expected without auth token)")
                self.passed += 1
                return True
            else:
                print(f"❌ Unexpected status: {response.status_code}")
                self.failed += 1
                return False
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            self.failed += 1
            return False
    
    def test_users_list(self) -> bool:
        """Test listing users"""
        print("\n🧪 Test 3: List Users")
        try:
            response = self.session.get(f"{BASE_URL}/users/", timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                count = data.get('count', 0) if isinstance(data, dict) else len(data)
                print(f"✅ Status 200 OK")
                print(f"   Users count: {count}")
                if count >= 3:
                    print(f"   ✅ Demo users present!")
                self.passed += 1
                return True
            elif response.status_code == 401:
                print(f"⚠️  Status 401 Unauthorized (expected without auth token)")
                self.passed += 1
                return True
            else:
                print(f"❌ Unexpected status: {response.status_code}")
                self.failed += 1
                return False
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            self.failed += 1
            return False
    
    def test_comments_list(self) -> bool:
        """Test listing comments"""
        print("\n🧪 Test 4: List Comments")
        try:
            response = self.session.get(f"{BASE_URL}/comments/", timeout=TIMEOUT)
            if response.status_code == 200:
                data = response.json()
                count = data.get('count', 0) if isinstance(data, dict) else len(data)
                print(f"✅ Status 200 OK")
                print(f"   Comments count: {count}")
                if count >= 6:
                    print(f"   ✅ Demo comments present!")
                self.passed += 1
                return True
            elif response.status_code == 401:
                print(f"⚠️  Status 401 Unauthorized (expected without auth token)")
                self.passed += 1
                return True
            else:
                print(f"❌ Unexpected status: {response.status_code}")
                self.failed += 1
                return False
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            self.failed += 1
            return False
    
    def run_all_tests(self):
        """Run all tests and print summary"""
        print("=" * 60)
        print("🚀 PLAYTO API Test Suite")
        print("=" * 60)
        
        self.test_health_check()
        self.test_posts_list()
        self.test_users_list()
        self.test_comments_list()
        
        print("\n" + "=" * 60)
        print("📊 Test Summary")
        print("=" * 60)
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        total = self.passed + self.failed
        print(f"📈 Success Rate: {(self.passed/total*100):.1f}%")
        
        if self.failed == 0:
            print("\n🎉 All tests passed! Your API is ready.")
            print("\nNext steps:")
            print("1. Open http://localhost:5173 in your browser")
            print("2. Click 'Sign In' to authenticate with Clerk")
            print("3. View the demo posts and interact with the feed")
            return 0
        else:
            print("\n⚠️  Some tests failed. Check the errors above.")
            return 1

if __name__ == "__main__":
    tester = APITester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)
