// ===== Algorithm Data Store =====
const ALGORITHMS = [
  // ===== SORTING =====
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    difficulty: 'easy',
    icon: '🫧',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed.',
    longDesc: `Bubble Sort is one of the simplest sorting algorithms. It works by repeatedly comparing adjacent elements and swapping them if needed. After each pass, the largest unsorted element "bubbles up" to its correct position. While simple to understand, it is inefficient for large datasets.`,
    useCases: 'Educational purposes, small datasets, nearly sorted arrays',
    code: {
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  // Outer loop: each pass places the next largest element at the end
  for (let i = 0; i < n - 1; i++) {
    let swapped = false; // Track if any swap happened this pass
    // Inner loop: compare adjacent pairs (skip already-sorted tail)
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap if left element is greater than right
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // Optimization: if no swaps occurred, array is already sorted
    if (!swapped) break;
  }
  return arr;
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    # Outer loop: each pass bubbles the largest unsorted element to the end
    for i in range(n - 1):
        swapped = False  # Track if any swap occurred
        # Inner loop: compare adjacent pairs
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]  # Swap
                swapped = True
        if not swapped: break  # Already sorted, stop early
    return arr`,
      cpp: `void bubbleSort(vector<int>& arr) {
  int n = arr.size();
  // Each pass places the next largest element at the end
  for (int i = 0; i < n-1; i++) {
    bool swapped = false; // Track if any swap happened
    // Compare adjacent pairs, skip already-sorted tail
    for (int j = 0; j < n-i-1; j++)
      if (arr[j] > arr[j+1]) { swap(arr[j], arr[j+1]); swapped = true; }
    if (!swapped) break; // Optimization: stop if already sorted
  }
}`,
      java: `void bubbleSort(int[] arr) {
  int n = arr.length;
  // Each pass places the next largest element at the end
  for (int i = 0; i < n-1; i++) {
    boolean swapped = false; // Track if any swap happened
    // Compare adjacent pairs
    for (int j = 0; j < n-i-1; j++)
      if (arr[j] > arr[j+1]) {
        int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t; // Swap
        swapped = true;
      }
    if (!swapped) break; // Stop early if sorted
  }
}`
    },
    related: ['insertion-sort', 'selection-sort', 'merge-sort'],
    tags: ['comparison', 'in-place', 'stable']
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    difficulty: 'medium',
    icon: '🔀',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    description: 'Merge Sort is a divide-and-conquer algorithm that splits the array in half, sorts each half recursively, then merges the sorted halves back together.',
    longDesc: `Merge Sort divides the input array into two halves, recursively sorts each half, and then merges the two sorted halves. It guarantees O(n log n) time complexity in all cases, making it efficient for large datasets. It requires O(n) extra space for the temporary arrays.`,
    useCases: 'Large datasets, linked lists, external sorting, stable sort needed',
    code: {
      javascript: `function mergeSort(arr) {
  // Base case: arrays of 0 or 1 elements are already sorted
  if (arr.length <= 1) return arr;
  // Divide: split the array into two halves
  const mid = Math.floor(arr.length / 2);
  // Conquer: recursively sort each half, then merge results
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}
function merge(L, R) {
  const res = []; let i = 0, j = 0;
  // Merge: pick the smaller element from each sorted half
  while (i < L.length && j < R.length)
    res.push(L[i] <= R[j] ? L[i++] : R[j++]);
  // Append any remaining elements from either half
  return [...res, ...L.slice(i), ...R.slice(j)];
}`,
      python: `def merge_sort(arr):
    if len(arr) <= 1: return arr  # Base case: already sorted
    mid = len(arr) // 2  # Find the middle point
    # Recursively sort each half, then merge
    L, R = merge_sort(arr[:mid]), merge_sort(arr[mid:])
    res, i, j = [], 0, 0
    # Merge: pick the smaller element from each half
    while i < len(L) and j < len(R):
        if L[i] <= R[j]: res.append(L[i]); i += 1
        else: res.append(R[j]); j += 1
    return res + L[i:] + R[j:]  # Append remaining elements`,
      cpp: `void merge(vector<int>& a, int l, int m, int r) {
  // Copy left and right halves into temp arrays
  vector<int> L(a.begin()+l, a.begin()+m+1);
  vector<int> R(a.begin()+m+1, a.begin()+r+1);
  int i = 0, j = 0, k = l;
  // Merge: pick smaller element from L or R
  while (i < L.size() && j < R.size())
    a[k++] = L[i] <= R[j] ? L[i++] : R[j++];
  while (i < L.size()) a[k++] = L[i++];  // Copy remaining from L
  while (j < R.size()) a[k++] = R[j++];  // Copy remaining from R
}
void mergeSort(vector<int>& a, int l, int r) {
  if (l >= r) return;  // Base case
  int m = l + (r - l) / 2;  // Find middle to avoid overflow
  mergeSort(a, l, m);
  mergeSort(a, m + 1, r);
  merge(a, l, m, r);
}`,
      java: `void mergeSort(int[] a, int l, int r) {
  if (l >= r) return;  // Base case: single element
  int m = l + (r - l) / 2;  // Find middle
  mergeSort(a, l, m);
  mergeSort(a, m + 1, r);  // Sort each half
  // Copy halves into temp arrays for merging
  int[] L = Arrays.copyOfRange(a, l, m + 1);
  int[] R = Arrays.copyOfRange(a, m + 1, r + 1);
  int i = 0, j = 0, k = l;
  // Merge: pick smaller element from L or R
  while (i < L.length && j < R.length)
    a[k++] = L[i] <= R[j] ? L[i++] : R[j++];
  while (i < L.length) a[k++] = L[i++];  // Copy remaining
  while (j < R.length) a[k++] = R[j++];
}`
    },
    related: ['quick-sort', 'bubble-sort', 'heap-sort'],
    tags: ['divide-and-conquer', 'recursive', 'stable']
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    difficulty: 'medium',
    icon: '⚡',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    description: 'Quick Sort selects a pivot element and partitions the array around the pivot, ensuring elements smaller than pivot are on the left and larger on the right.',
    longDesc: `Quick Sort is a highly efficient sorting algorithm that uses a divide-and-conquer strategy. It picks a pivot element and rearranges the array so that all elements smaller than the pivot come before it and all greater elements come after it. Then it recursively sorts the sub-arrays.`,
    useCases: 'General-purpose sorting, arrays, cache-friendly operations',
    code: {
      javascript: `function quickSort(arr, lo=0, hi=arr.length-1) {
  if (lo < hi) {
    // Partition around pivot; p is pivot's final sorted position
    const p = partition(arr, lo, hi);
    // Recursively sort elements before and after pivot
    quickSort(arr, lo, p-1); quickSort(arr, p+1, hi);
  }
  return arr;
}
function partition(arr, lo, hi) {
  const pivot = arr[hi]; // Choose last element as pivot
  let i = lo-1; // i tracks the boundary of elements <= pivot
  for (let j=lo; j<hi; j++)
    // If current element is <= pivot, move it to the left partition
    if (arr[j]<=pivot) { i++; [arr[i],arr[j]]=[arr[j],arr[i]]; }
  // Place pivot in its correct sorted position
  [arr[i+1],arr[hi]]=[arr[hi],arr[i+1]];
  return i+1; // Return pivot's final index
}`,
      python: `def quick_sort(arr, lo=0, hi=None):
    if hi is None: hi = len(arr)-1
    if lo < hi:
        p = partition(arr, lo, hi)  # Partition and get pivot index
        quick_sort(arr, lo, p-1)   # Sort left of pivot
        quick_sort(arr, p+1, hi)   # Sort right of pivot
def partition(arr, lo, hi):
    pivot, i = arr[hi], lo-1  # Pivot = last element
    for j in range(lo, hi):
        if arr[j] <= pivot:  # Move smaller elements to left
            i += 1; arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]  # Place pivot correctly
    return i+1  # Return pivot's final index`,
      cpp: `int partition(vector<int>& a, int lo, int hi) {
  int pivot = a[hi], i = lo - 1;  // Pivot = last element
  for (int j = lo; j < hi; j++) {
    if (a[j] <= pivot) {  // Move smaller left
      swap(a[++i], a[j]);
    }
  }
  swap(a[i + 1], a[hi]);
  return i + 1;  // Return pivot's index
}
void quickSort(vector<int>& a, int lo, int hi) {
  if (lo < hi) {
    int p = partition(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
  }
}`,
      java: `int partition(int[] a, int lo, int hi) {
  int pivot = a[hi], i = lo - 1;  // Pivot = last element
  for (int j = lo; j < hi; j++) {
    if (a[j] <= pivot) {
      // Swap a[i+1] and a[j]
      i++;
      int t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
  }
  // Place pivot in its correct position
  int t = a[i + 1];
  a[i + 1] = a[hi];
  a[hi] = t;
  return i + 1;
}
void quickSort(int[] a, int lo, int hi) {
  if (lo < hi) {
    int p = partition(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
  }
}`
    },
    related: ['merge-sort', 'heap-sort', 'insertion-sort'],
    tags: ['divide-and-conquer', 'in-place', 'recursive']
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    difficulty: 'easy',
    icon: '🃏',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description: 'Insertion Sort builds the sorted array one element at a time by inserting each element into its correct position among the previously sorted elements.',
    longDesc: `Insertion Sort iterates through the array and for each element, finds the correct position in the sorted portion and shifts elements to insert it there. It is efficient for small datasets and performs well on nearly sorted arrays.`,
    useCases: 'Small arrays, nearly sorted data, online sorting (streaming)',
    code: {
      javascript: `function insertionSort(arr) {
  // Start from index 1; element at index 0 is trivially sorted
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]; // Element to insert into sorted portion
    let j = i-1;
    // Shift elements right until we find the correct position for key
    while (j >= 0 && arr[j] > key) { arr[j+1] = arr[j]; j--; }
    arr[j+1] = key; // Insert key at the correct position
  }
  return arr;
}`,
      python: `def insertion_sort(arr):
    # Start from index 1; first element is trivially sorted
    for i in range(1, len(arr)):
        key, j = arr[i], i-1  # Element to insert
        # Shift larger elements right to make room
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]; j -= 1
        arr[j+1] = key  # Insert at correct position
    return arr`,
      cpp: `void insertionSort(vector<int>& arr) {
  // Start from index 1; element 0 is trivially sorted
  for (int i = 1; i < arr.size(); i++) {
    int key = arr[i];  // Element to insert
    int j = i - 1;
    // Shift larger elements right
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;  // Place at correct position
  }
}`,
      java: `void insertionSort(int[] arr) {
  // Start from index 1; element 0 is trivially sorted
  for (int i = 1; i < arr.length; i++) {
    int key = arr[i];  // Element to insert
    int j = i - 1;
    // Shift larger elements right
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;  // Place at correct position
  }
}`
    },
    related: ['bubble-sort', 'selection-sort', 'shell-sort'],
    tags: ['comparison', 'in-place', 'stable', 'online']
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    difficulty: 'easy',
    icon: '👆',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description: 'Selection Sort repeatedly finds the minimum element from the unsorted part and places it at the beginning.',
    longDesc: `Selection Sort divides the array into sorted and unsorted regions. It finds the minimum element in the unsorted region and swaps it to the end of the sorted region. This continues until the entire array is sorted. Simple but inefficient for large datasets.`,
    useCases: 'Small datasets, minimizing swaps, educational purposes',
    code: {
      javascript: `function selectionSort(arr) {
  // For each position, find the minimum in the unsorted portion
  for (let i = 0; i < arr.length-1; i++) {
    let min = i; // Assume current position holds the minimum
    // Scan the rest of the array for a smaller element
    for (let j = i+1; j < arr.length; j++)
      if (arr[j] < arr[min]) min = j;
    // Swap the found minimum with the element at position i
    if (min !== i) [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  return arr;
}`,
      python: `def selection_sort(arr):
    # For each position, find the minimum in unsorted portion
    for i in range(len(arr)-1):
        min_idx = i  # Assume current is minimum
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]: min_idx = j  # Found smaller
        arr[i], arr[min_idx] = arr[min_idx], arr[i]  # Swap minimum into place
    return arr`,
      cpp: `void selectionSort(vector<int>& arr) {
  // For each position, find the minimum in unsorted portion
  for (int i = 0; i < arr.size() - 1; i++) {
    int m = i;  // Assume current is minimum
    for (int j = i + 1; j < arr.size(); j++)
      if (arr[j] < arr[m]) m = j;  // Find smaller
    swap(arr[i], arr[m]);  // Place minimum at position i
  }
}`,
      java: `void selectionSort(int[] arr) {
  // For each position, find the minimum in unsorted portion
  for (int i = 0; i < arr.length - 1; i++) {
    int m = i;  // Assume current is minimum
    for (int j = i + 1; j < arr.length; j++)
      if (arr[j] < arr[m]) m = j;  // Find smaller
    // Swap minimum into place
    int t = arr[i];
    arr[i] = arr[m];
    arr[m] = t;
  }
}`
    },
    related: ['bubble-sort', 'insertion-sort', 'heap-sort'],
    tags: ['comparison', 'in-place', 'unstable']
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    difficulty: 'hard',
    icon: '🏔️',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description: 'Heap Sort builds a max-heap from the array, then repeatedly extracts the maximum element to build the sorted array from the end.',
    longDesc: `Heap Sort uses a binary heap data structure. First, a max-heap is built from the input array. Then, the root (maximum element) is swapped with the last element, the heap size is reduced, and heapify is called on the root. This process repeats until sorted.`,
    useCases: 'Guaranteed O(n log n) worst case, in-place sorting, priority queues',
    code: {
      javascript: `function heapSort(arr) {
  const n = arr.length;
  // Phase 1: Build a max-heap from the array (bottom-up)
  for (let i = Math.floor(n/2)-1; i >= 0; i--) heapify(arr, n, i);
  // Phase 2: Extract max one by one, placing it at the end
  for (let i = n-1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; // Move current max to end
    heapify(arr, i, 0); // Restore heap property on reduced heap
  }
}
function heapify(arr, n, i) {
  let lg = i, l = 2*i+1, r = 2*i+2; // Parent, left child, right child
  if (l < n && arr[l] > arr[lg]) lg = l; // Left child is larger
  if (r < n && arr[r] > arr[lg]) lg = r; // Right child is larger
  if (lg !== i) { // If largest is not the parent, swap and recurse
    [arr[i], arr[lg]] = [arr[lg], arr[i]];
    heapify(arr, n, lg);
  }
}`,
      python: `def heap_sort(arr):
    n = len(arr)
    # Phase 1: Build max-heap (bottom-up)
    for i in range(n//2-1, -1, -1):
        heapify(arr, n, i)
    # Phase 2: Extract max one by one
    for i in range(n-1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]  # Move max to end
        heapify(arr, i, 0)  # Restore heap on reduced array

def heapify(arr, n, i):
    lg = i  # Parent
    l, r = 2*i + 1, 2*i + 2  # Left child, right child
    if l < n and arr[l] > arr[lg]: lg = l  # Left is larger
    if r < n and arr[r] > arr[lg]: lg = r  # Right is larger
    if lg != i:
        arr[i], arr[lg] = arr[lg], arr[i]
        heapify(arr, n, lg)`,
      cpp: `void heapify(vector<int>& a, int n, int i) {
  int lg = i, l = 2*i + 1, r = 2*i + 2;  // Parent, left, right
  if (l < n && a[l] > a[lg]) lg = l;  // Left child is larger
  if (r < n && a[r] > a[lg]) lg = r;  // Right child is larger
  if (lg != i) {
    swap(a[i], a[lg]);  // Swap and recurse
    heapify(a, n, lg);
  }
}
void heapSort(vector<int>& a) {
  int n = a.size();
  // Build max-heap
  for (int i = n/2 - 1; i >= 0; i--)
    heapify(a, n, i);
  // Extract max one by one
  for (int i = n - 1; i > 0; i--) {
    swap(a[0], a[i]);
    heapify(a, i, 0);
  }
}`,
      java: `void heapSort(int[] a) {
  int n = a.length;
  // Build max-heap
  for (int i = n/2 - 1; i >= 0; i--)
    heapify(a, n, i);
  // Extract max one by one
  for (int i = n - 1; i > 0; i--) {
    int t = a[0];
    a[0] = a[i];
    a[i] = t;
    heapify(a, i, 0);
  }
}
void heapify(int[] a, int n, int i) {
  int lg = i, l = 2*i + 1, r = 2*i + 2;  // Parent, left, right
  if (l < n && a[l] > a[lg]) lg = l;  // Left child is larger
  if (r < n && a[r] > a[lg]) lg = r;  // Right child is larger
  if (lg != i) {
    int t = a[i];
    a[i] = a[lg];
    a[lg] = t;
    heapify(a, n, lg);  // Recurse
  }
}`
    },
    related: ['merge-sort', 'quick-sort', 'selection-sort'],
    tags: ['heap', 'in-place', 'unstable']
  },

  // ===== SEARCHING =====
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    difficulty: 'easy',
    icon: '🔍',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description: 'Linear Search sequentially checks each element of the list until a match is found or the whole list has been searched.',
    longDesc: `Linear Search is the simplest searching algorithm. It traverses the array from the beginning and compares each element with the target value. If a match is found, the position is returned; otherwise, -1 is returned. Works on both sorted and unsorted arrays.`,
    useCases: 'Unsorted arrays, small datasets, single search on a list',
    code: {
      javascript: `function linearSearch(arr, target) {
  // Check each element one by one from start to end
  for (let i = 0; i < arr.length; i++)
    if (arr[i] === target) return i; // Found! Return the index
  return -1; // Target not found in the array
}`,
      python: `def linear_search(arr, target):
    # Check each element one by one
    for i, val in enumerate(arr):
        if val == target: return i  # Found!
    return -1  # Not found`,
      cpp: `int linearSearch(vector<int>& arr, int target) {
  // Check each element sequentially
  for(int i=0;i<arr.size();i++)
    if(arr[i]==target) return i;  // Found!
  return -1;  // Not found
}`,
      java: `int linearSearch(int[] arr, int target) {
  // Check each element sequentially
  for(int i=0;i<arr.length;i++)
    if(arr[i]==target) return i;  // Found!
  return -1;  // Not found
}`
    },
    related: ['binary-search'],
    tags: ['sequential', 'unsorted']
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    difficulty: 'easy',
    icon: '🎯',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description: 'Binary Search works on sorted arrays by repeatedly dividing the search interval in half, dramatically reducing the number of comparisons needed.',
    longDesc: `Binary Search is a fast search algorithm that works on sorted arrays. It compares the target with the middle element; if equal, the position is returned. If the target is smaller, the left half is searched; if larger, the right half. This halves the search space with each comparison.`,
    useCases: 'Sorted arrays, large datasets, frequent searches',
    code: {
      javascript: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  // Keep halving the search space until found or exhausted
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid; // Found at mid!
    if (arr[mid] < target) left = mid + 1; // Target is in right half
    else right = mid - 1; // Target is in left half
  }
  return -1; // Target not in array
}`,
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    # Keep halving the search space
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target: return mid  # Found!
        elif arr[mid] < target: left = mid + 1  # Search right half
        else: right = mid - 1  # Search left half
    return -1  # Not found`,
      cpp: `int binarySearch(vector<int>& arr, int target) {
  int l=0, r=arr.size()-1;
  // Keep halving the search space
  while(l<=r) {
    int m=l+(r-l)/2;  // Avoid overflow
    if(arr[m]==target) return m;  // Found!
    arr[m]<target ? l=m+1 : r=m-1;  // Narrow search
  }
  return -1;  // Not found
}`,
      java: `int binarySearch(int[] arr, int target) {
  int l=0, r=arr.length-1;
  // Keep halving the search space
  while(l<=r) {
    int m=l+(r-l)/2;  // Avoid overflow
    if(arr[m]==target) return m;  // Found!
    if(arr[m]<target) l=m+1; else r=m-1;  // Narrow search
  }
  return -1;  // Not found
}`
    },
    related: ['linear-search', 'jump-search', 'interpolation-search'],
    tags: ['divide-and-conquer', 'sorted', 'efficient']
  },

  // ===== GRAPH =====
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    difficulty: 'medium',
    icon: '🌊',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description: 'BFS explores all vertices at the current depth before moving to vertices at the next depth level, using a queue data structure.',
    longDesc: `Breadth-First Search starts at a source vertex and explores all neighbors at the current depth before moving deeper. It uses a queue to track vertices to visit. BFS guarantees the shortest path in unweighted graphs.`,
    useCases: 'Shortest path in unweighted graphs, level-order traversal, social networks',
    code: {
      javascript: `function bfs(graph, start) {
  const visited = new Set([start]); // Track visited vertices
  const queue = [start], order = []; // FIFO queue for BFS
  while (queue.length > 0) {
    const v = queue.shift(); // Dequeue the front vertex
    order.push(v); // Record visit order
    // Explore all unvisited neighbors
    for (const nb of graph[v] || [])
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
  }
  return order; // Return vertices in BFS visit order
}`,
      python: `from collections import deque
def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        v = queue.popleft()  # Dequeue front vertex
        order.append(v)
        for nb in graph.get(v, []):  # Explore neighbors
            if nb not in visited:
                visited.add(nb)
                queue.append(nb)
    return order  # BFS visit order`,
      cpp: `vector<int> bfs(vector<vector<int>>& adj, int start) {
  vector<bool> vis(adj.size(), false);
  queue<int> q;
  q.push(start);
  vis[start] = true;
  vector<int> order;
  while (!q.empty()) {
    int v = q.front();
    q.pop();
    order.push_back(v);  // Dequeue front
    // Enqueue unvisited neighbors
    for (int nb : adj[v]) {
      if (!vis[nb]) {
        vis[nb] = true;
        q.push(nb);
      }
    }
  }
  return order;  // BFS visit order
}`,
      java: `List<Integer> bfs(List<List<Integer>> adj, int start) {
  boolean[] vis = new boolean[adj.size()];
  Queue<Integer> q = new LinkedList<>();
  q.add(start);
  vis[start] = true;
  List<Integer> order = new ArrayList<>();
  while (!q.isEmpty()) {
    int v = q.poll();
    order.add(v);  // Dequeue front
    // Enqueue unvisited neighbors
    for (int nb : adj.get(v)) {
      if (!vis[nb]) {
        vis[nb] = true;
        q.add(nb);
      }
    }
  }
  return order;  // BFS visit order
}`
    },
    related: ['dfs', 'dijkstra'],
    tags: ['graph', 'queue', 'shortest-path']
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    difficulty: 'medium',
    icon: '🌲',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description: 'DFS explores as far as possible along each branch before backtracking, using a stack (or recursion) to traverse the graph.',
    longDesc: `Depth-First Search starts at a source vertex and explores as far as possible along each branch before backtracking. It uses a stack (or recursion) to keep track of the path. DFS is useful for detecting cycles, topological sorting, and finding connected components.`,
    useCases: 'Cycle detection, topological sort, maze solving, connected components',
    code: {
      javascript: `function dfs(graph, start) {
  const visited = new Set(), stack = [start], order = [];
  while (stack.length > 0) {
    const v = stack.pop(); // Pop from top of stack (LIFO)
    if (!visited.has(v)) {
      visited.add(v); order.push(v); // Mark as visited
      // Push neighbors in reverse order so leftmost is visited first
      for (const nb of (graph[v]||[]).reverse()) stack.push(nb);
    }
  }
  return order; // Return vertices in DFS visit order
}`,
      python: `def dfs(graph, start):
    visited = set()
    stack = [start]
    order = []
    while stack:
        v = stack.pop()  # Pop from top (LIFO)
        if v not in visited:
            visited.add(v)
            order.append(v)  # Mark visited
            # Push neighbors reversed so leftmost is visited first
            for nb in reversed(graph.get(v, [])):
                stack.append(nb)
    return order  # DFS visit order`,
      cpp: `vector<int> dfs(vector<vector<int>>& adj, int start) {
  vector<bool> vis(adj.size(), false);
  stack<int> st;
  st.push(start);
  vector<int> order;
  while (!st.empty()) {
    int v = st.top();
    st.pop();  // Pop from top (LIFO)
    if (!vis[v]) {
      vis[v] = true;
      order.push_back(v);  // Mark visited
      // Push neighbors reversed so leftmost is visited first
      for (int i = adj[v].size() - 1; i >= 0; i--)
        st.push(adj[v][i]);
    }
  }
  return order;  // DFS visit order
}`,
      java: `List<Integer> dfs(List<List<Integer>> adj, int start) {
  boolean[] vis = new boolean[adj.size()];
  Stack<Integer> st = new Stack<>();
  st.push(start);
  List<Integer> order = new ArrayList<>();
  while (!st.isEmpty()) {
    int v = st.pop();  // Pop from top (LIFO)
    if (!vis[v]) {
      vis[v] = true;
      order.add(v);  // Mark visited
      List<Integer> nb = adj.get(v);
      // Push neighbors reversed so leftmost is visited first
      for (int i = nb.size() - 1; i >= 0; i--)
        st.push(nb.get(i));
    }
  }
  return order;  // DFS visit order
}`
    },
    related: ['bfs', 'dijkstra'],
    tags: ['graph', 'stack', 'recursive']
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    difficulty: 'hard',
    icon: '🗺️',
    timeComplexity: { best: 'O(V²)', average: 'O((V+E) log V)', worst: 'O(V²)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description: "Dijkstra's algorithm finds the shortest path between nodes in a weighted graph by greedily selecting the minimum distance vertex at each step.",
    longDesc: `Dijkstra's algorithm solves the single-source shortest path problem for graphs with non-negative edge weights. It maintains a priority queue of vertices ordered by their distance from the source and repeatedly relaxes edges to find the shortest path to each vertex.`,
    useCases: 'GPS navigation, network routing, shortest path in weighted graphs',
    code: {
      javascript: `function dijkstra(graph, start) {
  const dist = {}, vis = new Set();
  // Initialize all distances to Infinity except the source
  for (const v in graph) dist[v] = Infinity;
  dist[start] = 0;
  while (true) {
    // Greedily pick the unvisited vertex with smallest distance
    let u = null;
    for (const v in dist)
      if (!vis.has(v) && (u===null || dist[v]<dist[u])) u = v;
    if (!u || dist[u]===Infinity) break; // All reachable visited
    vis.add(u);
    // Relax edges: update neighbor distances if shorter path found
    for (const [v, w] of graph[u] || [])
      if (dist[u]+w < dist[v]) dist[v] = dist[u]+w;
  }
  return dist; // Shortest distances from start to all vertices
}`,
      python: `import heapq
def dijkstra(graph, start):
    dist = {v: float('inf') for v in graph}  # Init all distances to infinity
    dist[start] = 0; pq = [(0, start)]  # Min-heap priority queue
    while pq:
        d, u = heapq.heappop(pq)  # Get closest unvisited vertex
        if d > dist[u]: continue  # Skip if already found shorter
        for v, w in graph.get(u, []):  # Relax edges
            if dist[u]+w < dist[v]:
                dist[v] = dist[u]+w  # Update shorter distance
                heapq.heappush(pq, (dist[v], v))
    return dist  # Shortest distances from source`,
      cpp: `vector<int> dijkstra(vector<vector<pair<int,int>>>& g, int s) {
  int n = g.size();
  vector<int> d(n, INT_MAX);
  d[s] = 0;
  // Min-heap: {distance, vertex}
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
  pq.push({0, s});
  while (!pq.empty()) {
    auto [dist, u] = pq.top();
    pq.pop();
    if (dist > d[u]) continue;  // Skip if already found shorter
    // Relax edges: update neighbor distances
    for (auto [v, w] : g[u]) {
      if (d[u] + w < d[v]) {
        d[v] = d[u] + w;
        pq.push({d[v], v});
      }
    }
  }
  return d;  // Shortest distances from source
}`,
      java: `int[] dijkstra(List<int[]>[] g, int s) {
  int n = g.length;
  int[] d = new int[n];
  Arrays.fill(d, Integer.MAX_VALUE);
  d[s] = 0;
  // Min-heap: {distance, vertex}
  PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[0] - b[0]);
  pq.add(new int[]{0, s});
  while (!pq.isEmpty()) {
    int[] t = pq.poll();
    int dist = t[0], u = t[1];
    if (dist > d[u]) continue;  // Skip if already found shorter
    // Relax edges: update neighbor distances
    for (int[] e : g[u]) {
      if (d[u] + e[1] < d[e[0]]) {
        d[e[0]] = d[u] + e[1];
        pq.add(new int[]{d[e[0]], e[0]});
      }
    }
  }
  return d;  // Shortest distances from source
}`
    },
    related: ['bfs', 'bellman-ford', 'a-star'],
    tags: ['graph', 'greedy', 'shortest-path', 'weighted']
  },

  // ===== DYNAMIC PROGRAMMING =====
  {
    id: 'fibonacci-dp',
    name: 'Fibonacci (DP)',
    category: 'dp',
    difficulty: 'easy',
    icon: '🌀',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    description: 'Dynamic Programming approach to Fibonacci avoids redundant calculations by storing computed values, reducing exponential to linear time.',
    longDesc: `The naive recursive Fibonacci has O(2^n) complexity due to overlapping subproblems. Dynamic Programming (memoization/tabulation) stores computed results so each subproblem is solved only once, achieving O(n) time complexity.`,
    useCases: 'Introduction to DP concepts, memoization demonstration',
    code: {
      javascript: `function fibonacci(n) {
  if (n <= 1) return n; // Base cases: F(0)=0, F(1)=1
  const dp = [0, 1]; // Tabulation array storing computed values
  // Build up from bottom: each F(i) = F(i-1) + F(i-2)
  for (let i = 2; i <= n; i++)
    dp[i] = dp[i-1] + dp[i-2];
  return dp[n]; // Return the nth Fibonacci number
}`,
      python: `def fibonacci(n):
    if n <= 1: return n  # Base cases: F(0)=0, F(1)=1
    dp = [0, 1]  # Tabulation array
    # Build up: each F(i) = F(i-1) + F(i-2)
    for i in range(2, n+1):
        dp.append(dp[-1] + dp[-2])
    return dp[n]  # Return nth Fibonacci number`,
      cpp: `int fibonacci(int n) {
  if(n<=1) return n;  // Base cases
  vector<int> dp(n+1); dp[0]=0; dp[1]=1;
  // Build up: each F(i) = F(i-1) + F(i-2)
  for(int i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2];
  return dp[n];  // Return nth Fibonacci number
}`,
      java: `int fibonacci(int n) {
  if(n<=1) return n;  // Base cases
  int[] dp = new int[n+1]; dp[0]=0; dp[1]=1;
  // Build up: each F(i) = F(i-1) + F(i-2)
  for(int i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2];
  return dp[n];  // Return nth Fibonacci number
}`
    },
    related: ['knapsack', 'lcs'],
    tags: ['dp', 'memoization', 'tabulation']
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    category: 'dp',
    difficulty: 'hard',
    icon: '🎒',
    timeComplexity: { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)' },
    spaceComplexity: 'O(nW)',
    stable: true,
    description: 'The 0/1 Knapsack problem maximizes value under a weight constraint. DP solves it by building a table of optimal solutions for subproblems.',
    longDesc: `Given items with weights and values, the 0/1 Knapsack problem asks: what is the maximum value we can achieve with a given weight capacity? Each item can be included or excluded. DP fills a 2D table where dp[i][w] represents the max value using first i items and weight capacity w.`,
    useCases: 'Resource allocation, budget planning, cut stock problem',
    code: {
      javascript: `function knapsack(W, wt, val, n) {
  // dp[i][w] = max value using first i items with capacity w
  const dp = Array(n+1).fill(null).map(()=>Array(W+1).fill(0));
  for(let i=1;i<=n;i++)
    for(let w=0;w<=W;w++) {
      dp[i][w] = dp[i-1][w]; // Skip item i
      // Include item i if it fits and yields better value
      if(wt[i-1]<=w) dp[i][w]=Math.max(dp[i][w], val[i-1]+dp[i-1][w-wt[i-1]]);
    }
  return dp[n][W]; // Maximum value achievable
}`,
      python: `def knapsack(W, wt, val, n):
    # dp[i][w] = max value using first i items with capacity w
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(W+1):
            dp[i][w] = dp[i-1][w]  # Skip item i
            # Include item i if it fits and gives better value
            if wt[i-1] <= w:
                dp[i][w] = max(dp[i][w], val[i-1]+dp[i-1][w-wt[i-1]])
    return dp[n][W]  # Maximum value achievable`,
      cpp: `int knapsack(int W, vector<int>& wt, vector<int>& val, int n) {
  // dp[i][w] = max value using first i items with capacity w
  vector<vector<int>> dp(n+1, vector<int>(W+1,0));
  for(int i=1;i<=n;i++)
    for(int w=0;w<=W;w++) {
      dp[i][w]=dp[i-1][w];  // Skip item i
      // Include item i if it fits and gives better value
      if(wt[i-1]<=w) dp[i][w]=max(dp[i][w],val[i-1]+dp[i-1][w-wt[i-1]]);
    }
  return dp[n][W];  // Maximum value achievable
}`,
      java: `int knapsack(int W, int[] wt, int[] val, int n) {
  // dp[i][w] = max value using first i items with capacity w
  int[][] dp = new int[n+1][W+1];
  for(int i=1;i<=n;i++)
    for(int w=0;w<=W;w++) {
      dp[i][w]=dp[i-1][w];  // Skip item i
      // Include item i if it fits and gives better value
      if(wt[i-1]<=w) dp[i][w]=Math.max(dp[i][w],val[i-1]+dp[i-1][w-wt[i-1]]);
    }
  return dp[n][W];  // Maximum value achievable
}`
    },
    related: ['fibonacci-dp', 'lcs'],
    tags: ['dp', 'optimization', 'combinatorics']
  },

  // ===== MORE SORTING =====
  {
    id: 'shell-sort',
    name: 'Shell Sort',
    category: 'sorting',
    difficulty: 'medium',
    icon: '🐚',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log² n)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    description: 'Shell Sort is an optimized Insertion Sort that compares elements far apart, gradually reducing the gap to produce a nearly sorted array before the final pass.',
    longDesc: `Shell Sort improves Insertion Sort by sorting elements that are far apart first, using a decreasing "gap" sequence. This moves elements quickly toward their final positions. When gap=1, it becomes a regular Insertion Sort on a nearly-sorted array, making it very efficient.`,
    useCases: 'Medium-sized arrays, embedded systems with limited memory, when average performance matters',
    code: {
      javascript: `function shellSort(arr) {
  let gap = Math.floor(arr.length / 2); // Start with a large gap
  while (gap > 0) {
    // Perform gapped insertion sort for this gap size
    for (let i = gap; i < arr.length; i++) {
      const temp = arr[i]; // Element to insert
      let j = i;
      // Shift earlier gap-sorted elements up until correct location found
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp; // Place element at its correct position
    }
    gap = Math.floor(gap / 2); // Reduce gap for next pass
  }
  return arr;
}`,
      python: `def shell_sort(arr):
    gap = len(arr) // 2  # Start with a large gap
    while gap > 0:
        # Gapped insertion sort for this gap size
        for i in range(gap, len(arr)):
            temp, j = arr[i], i  # Element to insert
            # Shift gap-sorted elements until correct position found
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]; j -= gap
            arr[j] = temp  # Place at correct position
        gap //= 2  # Reduce gap
    return arr`,
      cpp: `void shellSort(vector<int>& arr) {
  // Start with large gap, reduce each pass
  for (int gap = arr.size()/2; gap > 0; gap /= 2) {
    for (int i = gap; i < arr.size(); i++) {
      int temp = arr[i];  // Element to insert
      int j = i;
      // Shift gap-sorted elements until correct position
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;  // Place at correct position
    }
  }
}`,
      java: `void shellSort(int[] arr) {
  // Start with large gap, reduce each pass
  for (int gap = arr.length/2; gap > 0; gap /= 2) {
    for (int i = gap; i < arr.length; i++) {
      int temp = arr[i];  // Element to insert
      int j = i;
      // Shift gap-sorted elements until correct position
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;  // Place at correct position
    }
  }
}`
    },
    related: ['insertion-sort', 'bubble-sort', 'merge-sort'],
    tags: ['comparison', 'in-place', 'gap-sequence']
  },
  {
    id: 'counting-sort',
    name: 'Counting Sort',
    category: 'sorting',
    difficulty: 'easy',
    icon: '🔢',
    timeComplexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)' },
    spaceComplexity: 'O(k)',
    stable: true,
    description: 'Counting Sort counts occurrences of each element, then uses cumulative counts to place each element in its correct position. Works only with integers in a known range.',
    longDesc: `Counting Sort is a non-comparison sorting algorithm. It counts how many times each value appears, computes a prefix sum to determine positions, then places elements in sorted order. Time complexity is O(n+k) where k is the range of values — much faster than O(n log n) when k is small.`,
    useCases: 'Integer sorting with small range, stable sort needed, radix sort base, vote counting',
    code: {
      javascript: `function countingSort(arr) {
  const max = Math.max(...arr); // Find the maximum value
  const count = new Array(max + 1).fill(0); // Count array for each value
  arr.forEach(v => count[v]++); // Count occurrences of each element
  // Prefix sum: count[i] now holds the position of element i in output
  for (let i = 1; i <= max; i++) count[i] += count[i-1];
  const out = new Array(arr.length);
  // Build the output array (iterate backward for stability)
  for (let i = arr.length-1; i >= 0; i--) {
    out[--count[arr[i]]] = arr[i];
  }
  return out;
}`,
      python: `def counting_sort(arr):
    max_v = max(arr)  # Find max value
    count = [0] * (max_v + 1)  # Count array
    for v in arr: count[v] += 1  # Count occurrences
    # Prefix sum: positions in output
    for i in range(1, max_v+1): count[i] += count[i-1]
    out = [0] * len(arr)
    # Build output (reversed for stability)
    for v in reversed(arr):
        count[v] -= 1; out[count[v]] = v
    return out`,
      cpp: `vector<int> countingSort(vector<int>& arr) {
  int mx=*max_element(arr.begin(),arr.end());  // Find max
  vector<int> cnt(mx+1,0), out(arr.size());
  for(int v:arr) cnt[v]++;  // Count occurrences
  for(int i=1;i<=mx;i++) cnt[i]+=cnt[i-1];  // Prefix sum
  // Build output (reversed for stability)
  for(int i=arr.size()-1;i>=0;i--) out[--cnt[arr[i]]]=arr[i];
  return out;
}`,
      java: `int[] countingSort(int[] arr) {
  int mx=Arrays.stream(arr).max().getAsInt();  // Find max
  int[] cnt=new int[mx+1], out=new int[arr.length];
  for(int v:arr) cnt[v]++;  // Count occurrences
  for(int i=1;i<=mx;i++) cnt[i]+=cnt[i-1];  // Prefix sum
  // Build output (reversed for stability)
  for(int i=arr.length-1;i>=0;i--) out[--cnt[arr[i]]]=arr[i];
  return out;
}`
    },
    related: ['merge-sort', 'bubble-sort', 'radix-sort'],
    tags: ['non-comparison', 'stable', 'linear-time', 'integer']
  },

  // ===== MORE SEARCHING =====
  {
    id: 'jump-search',
    name: 'Jump Search',
    category: 'searching',
    difficulty: 'medium',
    icon: '🦘',
    timeComplexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description: 'Jump Search works on sorted arrays by jumping ahead by fixed steps of √n, then doing a linear search backward in the identified block.',
    longDesc: `Jump Search finds the optimal block size of √n elements to skip over. It jumps forward by √n steps until it finds a block where the element may lie, then does a linear search in that block. Faster than linear search O(n) but slower than binary search O(log n). Best for when backward traversal is expensive.`,
    useCases: 'Sorted arrays where jumping back is costly, large sorted data, systems where binary search is impractical',
    code: {
      javascript: `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n)); // Optimal jump size = √n
  let prev = 0, curr = step;
  // Jump forward in blocks of √n until we overshoot the target
  while (curr < n && arr[curr] < target) {
    prev = curr; curr += step;
  }
  // Linear search within the identified block
  for (let i = prev; i < Math.min(curr, n); i++) {
    if (arr[i] === target) return i; // Found!
  }
  return -1; // Not found
}`,
      python: `import math
def jump_search(arr, target):
    n, step, prev = len(arr), int(math.sqrt(len(arr))), 0  # Jump size = √n
    curr = step
    # Jump forward in blocks until we overshoot
    while curr < n and arr[curr] < target:
        prev, curr = curr, curr + step
    # Linear search within the identified block
    for i in range(prev, min(curr, n)):
        if arr[i] == target: return i  # Found!
    return -1  # Not found`,
      cpp: `int jumpSearch(vector<int>& arr, int target) {
  int n = arr.size();
  int step = sqrt(n);  // Jump size = √n
  int prev = 0, curr = step;
  // Jump forward in blocks until we overshoot
  while (curr < n && arr[curr] < target) {
    prev = curr;
    curr += step;
  }
  // Linear search within the identified block
  for (int i = prev; i < min(curr, n); i++)
    if (arr[i] == target) return i;  // Found!
  return -1;  // Not found
}`,
      java: `int jumpSearch(int[] arr, int target) {
  int n = arr.length;
  int step = (int) Math.sqrt(n);  // Jump = √n
  int prev = 0, curr = step;
  // Jump forward in blocks until we overshoot
  while (curr < n && arr[curr] < target) {
    prev = curr;
    curr += step;
  }
  // Linear search within the identified block
  for (int i = prev; i < Math.min(curr, n); i++)
    if (arr[i] == target) return i;  // Found!
  return -1;  // Not found
}`
    },
    related: ['linear-search', 'binary-search'],
    tags: ['sorted', 'block-search', 'sqrt']
  },

  // ===== MORE DP =====
  {
    id: 'coin-change',
    name: 'Coin Change',
    category: 'dp',
    difficulty: 'medium',
    icon: '🪙',
    timeComplexity: { best: 'O(amount)', average: 'O(n·amount)', worst: 'O(n·amount)' },
    spaceComplexity: 'O(amount)',
    stable: true,
    description: 'Coin Change finds the minimum number of coins needed to make a given amount. DP builds up solutions from amount=0 to the target.',
    longDesc: `Given coin denominations, find the fewest coins to make the target amount. dp[i] stores the minimum coins needed for amount i. For each amount, try every coin — if using that coin leads to fewer coins, update dp[i]. Starting from dp[0]=0, each subsequent amount builds on previous results.`,
    useCases: 'Currency exchange, change-making, resource allocation problems',
    code: {
      javascript: `function coinChange(coins, amount) {
  // dp[i] = minimum coins needed to make amount i
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case: 0 coins needed for amount 0
  for (let i = 1; i <= amount; i++)
    for (const c of coins)
      // If coin fits and using it gives fewer coins, update
      if (c <= i && dp[i - c] + 1 < dp[i])
        dp[i] = dp[i - c] + 1;
  return dp[amount] === Infinity ? -1 : dp[amount]; // -1 if impossible
}`,
      python: `def coin_change(coins, amount):
    # dp[i] = min coins needed for amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins for amount 0
    for i in range(1, amount + 1):
        for c in coins:
            # If coin fits and gives fewer coins, update
            if c <= i and dp[i-c] + 1 < dp[i]:
                dp[i] = dp[i-c] + 1
    return dp[amount] if dp[amount] != float('inf') else -1  # -1 if impossible`,
      cpp: `int coinChange(vector<int>& coins, int amount) {
  // dp[i] = min coins needed for amount i
  vector<int> dp(amount+1, INT_MAX);
  dp[0]=0;  // Base case: 0 coins for amount 0
  for(int i=1;i<=amount;i++)
    for(int c:coins)
      // If coin fits and gives fewer coins, update
      if(c<=i && dp[i-c]!=INT_MAX)
        dp[i]=min(dp[i],dp[i-c]+1);
  return dp[amount]==INT_MAX?-1:dp[amount];  // -1 if impossible
}`,
      java: `int coinChange(int[] coins, int amount) {
  // dp[i] = min coins needed for amount i
  int[] dp = new int[amount + 1];
  Arrays.fill(dp, Integer.MAX_VALUE);
  dp[0] = 0;  // Base case
  for (int i = 1; i <= amount; i++)
    for (int c : coins)
      // If coin fits and gives fewer coins, update
      if (c <= i && dp[i - c] != Integer.MAX_VALUE)
        dp[i] = Math.min(dp[i], dp[i - c] + 1);
  return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];  // -1 if impossible
}`
    },
    related: ['knapsack', 'fibonacci-dp', 'lcs'],
    tags: ['dp', 'greedy', 'optimization']
  },
  {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'dp',
    difficulty: 'hard',
    icon: '🧬',
    timeComplexity: { best: 'O(m·n)', average: 'O(m·n)', worst: 'O(m·n)' },
    spaceComplexity: 'O(m·n)',
    stable: true,
    description: 'LCS finds the longest subsequence common to two sequences. A subsequence maintains relative order but need not be contiguous.',
    longDesc: `The Longest Common Subsequence finds the longest sequence that appears in the same order in both input strings (but not necessarily contiguous). dp[i][j] stores the LCS length for the first i characters of text1 and j characters of text2. If characters match, extend the LCS; otherwise take the maximum of the two options.`,
    useCases: 'DNA sequence alignment, diff tools (git diff), spell correction, file comparison',
    code: {
      javascript: `function lcs(text1, text2) {
  const m = text1.length, n = text2.length;
  // dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]
  const dp = Array(m+1).fill(null).map(() => Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = text1[i-1] === text2[j-1]
        ? dp[i-1][j-1] + 1 // Characters match: extend LCS by 1
        : Math.max(dp[i-1][j], dp[i][j-1]); // Take the longer option
  return dp[m][n]; // Length of the longest common subsequence
}`,
      python: `def lcs(text1, text2):
    m, n = len(text1), len(text2)
    # dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1]+1  # Match: extend
            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # Take longer option
    return dp[m][n]  # Length of LCS`,
      cpp: `int lcs(string& a, string& b) {
  int m=a.size(), n=b.size();
  // dp[i][j] = LCS length of a[0..i-1] and b[0..j-1]
  vector<vector<int>> dp(m+1,vector<int>(n+1,0));
  for(int i=1;i<=m;i++)
    for(int j=1;j<=n;j++)
      // Match: extend by 1; else take longer option
      dp[i][j]=a[i-1]==b[j-1]?dp[i-1][j-1]+1:max(dp[i-1][j],dp[i][j-1]);
  return dp[m][n];  // Length of LCS
}`,
      java: `int lcs(String a, String b) {
  int m=a.length(), n=b.length();
  // dp[i][j] = LCS length of a[0..i-1] and b[0..j-1]
  int[][] dp=new int[m+1][n+1];
  for(int i=1;i<=m;i++)
    for(int j=1;j<=n;j++)
      // Match: extend by 1; else take longer option
      dp[i][j]=a.charAt(i-1)==b.charAt(j-1)?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
  return dp[m][n];  // Length of LCS
}`
    },
    related: ['knapsack', 'coin-change', 'fibonacci-dp'],
    tags: ['dp', 'string', 'sequence']
  },

  // ===== MORE GRAPH =====
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford',
    category: 'graph',
    difficulty: 'hard',
    icon: '🛤️',
    timeComplexity: { best: 'O(VE)', average: 'O(VE)', worst: 'O(VE)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description: 'Bellman-Ford finds shortest paths from a source vertex, handling negative edge weights — unlike Dijkstra. It also detects negative weight cycles.',
    longDesc: `Bellman-Ford relaxes all edges V-1 times. After each iteration, the shortest distance to each vertex converges. Unlike Dijkstra, it handles negative edge weights. If any edge can still be relaxed after V-1 iterations, a negative cycle exists. Time complexity is O(VE).`,
    useCases: 'Graphs with negative edge weights, detecting negative cycles, network routing protocols (RIP)',
    code: {
      javascript: `function bellmanFord(V, edges, src) {
  // Initialize all distances to Infinity; source distance = 0
  const dist = Array(V).fill(Infinity);
  dist[src] = 0;
  // Relax all edges V-1 times (shortest path has at most V-1 edges)
  for (let i = 0; i < V - 1; i++)
    for (const [u, v, w] of edges)
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  // Check for negative-weight cycles (if still relaxable, cycle exists)
  for (const [u, v, w] of edges)
    if (dist[u] + w < dist[v]) return null; // Negative cycle detected
  return dist; // Shortest distances from source
}`,
      python: `def bellman_ford(V, edges, src):
    dist = [float('inf')] * V  # Init all distances to infinity
    dist[src] = 0  # Source distance = 0
    # Relax all edges V-1 times
    for _ in range(V - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]: dist[v] = dist[u] + w  # Relax
    # Check for negative-weight cycles
    for u, v, w in edges:
        if dist[u] + w < dist[v]: return None  # Negative cycle found
    return dist  # Shortest distances from source`,
      cpp: `vector<int> bellmanFord(int V, vector<tuple<int,int,int>>& edges, int src) {
  vector<int> dist(V, INT_MAX); dist[src]=0;  // Init distances
  // Relax all edges V-1 times
  for(int i=0;i<V-1;i++)
    for(auto&[u,v,w]:edges)
      if(dist[u]!=INT_MAX && dist[u]+w<dist[v]) dist[v]=dist[u]+w;  // Relax
  // Check for negative-weight cycles
  for(auto&[u,v,w]:edges)
    if(dist[u]!=INT_MAX && dist[u]+w<dist[v]) return {};  // Neg cycle
  return dist;  // Shortest distances
}`,
      java: `int[] bellmanFord(int V, int[][] edges, int src) {
  int[] dist = new int[V];
  Arrays.fill(dist, Integer.MAX_VALUE);
  dist[src] = 0;
  // Relax all edges V-1 times
  for (int i = 0; i < V - 1; i++)
    for (int[] e : edges)
      if (dist[e[0]] != Integer.MAX_VALUE && dist[e[0]] + e[2] < dist[e[1]])
        dist[e[1]] = dist[e[0]] + e[2];  // Relax edge
  return dist;  // Shortest distances
}`
    },
    related: ['dijkstra', 'bfs', 'dfs'],
    tags: ['graph', 'shortest-path', 'negative-weights', 'dynamic-programming']
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort',
    category: 'sorting',
    difficulty: 'medium',
    icon: '🗂️',
    timeComplexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
    spaceComplexity: 'O(n+k)',
    stable: true,
    description: 'Radix Sort sorts integers by processing individual digits, from least significant to most significant.',
    longDesc: `Radix Sort is a non-comparative algorithm that sorts keys digit by digit. It uses Counting Sort as a stable subroutine to sort the array based on the current digit's value. Its time complexity is O(nk) where n is the number of elements and k is the number of digits.`,
    useCases: 'Sorting phone numbers, dates, or large lists of integers',
    code: {
      javascript: `function radixSort(arr) {
  if (!arr.length) return arr;
  const max = Math.max(...arr);
  // Process each digit position: 1s, 10s, 100s, ...
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10)
    countingSortByDigit(arr, exp); // Stable sort by current digit
  return arr;
}
function countingSortByDigit(arr, exp) {
  const count = Array(10).fill(0), out = Array(arr.length);
  // Count occurrences of each digit (0-9) at current position
  for (let v of arr) count[Math.floor(v / exp) % 10]++;
  // Convert counts to cumulative positions
  for (let i = 1; i < 10; i++) count[i] += count[i-1];
  // Build output array (backward for stability)
  for (let i = arr.length - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    out[--count[digit]] = arr[i];
  }
  // Copy output back to original array
  for (let i = 0; i < arr.length; i++) arr[i] = out[i];
}`,
      python: `def radix_sort(arr):
    if not arr: return arr
    max_val = max(arr)  # Find max to know number of digits
    exp = 1
    # Process each digit: 1s, 10s, 100s, ...
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)  # Stable sort by digit
        exp *= 10
    return arr
def counting_sort_by_digit(arr, exp):
    count, out = [0] * 10, [0] * len(arr)
    for v in arr: count[(v // exp) % 10] += 1  # Count digit occurrences
    for i in range(1, 10): count[i] += count[i-1]  # Cumulative positions
    # Build output (backward for stability)
    for v in reversed(arr):
        idx = (v // exp) % 10
        count[idx] -= 1
        out[count[idx]] = v
    for i in range(len(arr)): arr[i] = out[i]  # Copy back`,
      cpp: `void countingSortByDigit(vector<int>& arr, int exp) {
  vector<int> count(10, 0), out(arr.size());
  for (int v : arr) count[(v / exp) % 10]++;  // Count digit occurrences
  for (int i = 1; i < 10; i++) count[i] += count[i-1];  // Cumulative
  // Build output (backward for stability)
  for (int i = arr.size() - 1; i >= 0; i--) {
    int digit = (arr[i] / exp) % 10;
    out[--count[digit]] = arr[i];
  }
  arr = out;  // Copy back
}
void radixSort(vector<int>& arr) {
  if (arr.empty()) return;
  int mx = *max_element(arr.begin(), arr.end());  // Max value
  // Process each digit position
  for (int exp = 1; mx / exp > 0; exp *= 10)
    countingSortByDigit(arr, exp);
}`,
      java: `void countingSortByDigit(int[] arr, int exp) {
  int[] count = new int[10], out = new int[arr.length];
  for (int v : arr) count[(v / exp) % 10]++;  // Count digit occurrences
  for (int i = 1; i < 10; i++) count[i] += count[i-1];  // Cumulative
  // Build output (backward for stability)
  for (int i = arr.length - 1; i >= 0; i--) {
    int digit = (arr[i] / exp) % 10;
    out[--count[digit]] = arr[i];
  }
  System.arraycopy(out, 0, arr, 0, arr.length);  // Copy back
}
void radixSort(int[] arr) {
  if (arr.length == 0) return;
  int mx = Arrays.stream(arr).max().getAsInt();  // Max value
  // Process each digit position
  for (int exp = 1; mx / exp > 0; exp *= 10)
    countingSortByDigit(arr, exp);
}`
    },
    related: ['counting-sort', 'bucket-sort'],
    tags: ['non-comparison', 'stable', 'digits']
  },
  {
    id: 'exponential-search',
    name: 'Exponential Search',
    category: 'searching',
    difficulty: 'easy',
    icon: '🚀',
    timeComplexity: { best: 'O(1)', average: 'O(log i)', worst: 'O(log i)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description: 'Exponential Search finds the range where the target must lie by doubling the index, then performs Binary Search within that range.',
    longDesc: `This algorithm is useful for unbounded/infinite arrays or when the target is closer to the beginning. It starts with a window size of 1 and doubles it until the element at the index is greater than the target. Finally, it uses binary search within the identified range.`,
    useCases: 'Unbounded arrays, when target is near the beginning of the array',
    code: {
      javascript: `function exponentialSearch(arr, target) {
  if (arr[0] === target) return 0; // Check first element
  let i = 1, n = arr.length;
  // Double the index until we overshoot or find the range
  while (i < n && arr[i] <= target) i *= 2;
  // Binary search within the found range [i/2, min(i, n-1)]
  let left = Math.floor(i / 2), right = Math.min(i, n - 1);
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid; // Found!
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1; // Not found
}`,
      python: `def exponential_search(arr, target):
    if arr[0] == target: return 0  # Check first element
    i, n = 1, len(arr)
    # Double index until we overshoot or find the range
    while i < n and arr[i] <= target: i *= 2
    # Binary search within the found range
    left, right = i // 2, min(i, n - 1)
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target: return mid  # Found!
        elif arr[mid] < target: left = mid + 1  # Search right
        else: right = mid - 1  # Search left
    return -1  # Not found`,
      cpp: `int exponentialSearch(vector<int>& arr, int target) {
  if(arr[0] == target) return 0;  // Check first element
  int i = 1, n = arr.size();
  while(i < n && arr[i] <= target) i *= 2;  // Double until overshoot
  // Binary search within the found range [i/2, min(i, n-1)]
  int l = i / 2, r = min(i, n - 1);
  while(l <= r) {
    int m = l + (r - l) / 2;  // Avoid overflow
    if(arr[m] == target) return m;  // Found!
    arr[m] < target ? l = m + 1 : r = m - 1;  // Narrow search
  }
  return -1;  // Not found
}`,
      java: `int exponentialSearch(int[] arr, int target) {
  if(arr[0] == target) return 0;  // Check first element
  int i = 1, n = arr.length;
  while(i < n && arr[i] <= target) i *= 2;  // Double until overshoot
  // Binary search within the found range
  int l = i / 2, r = Math.min(i, n - 1);
  while(l <= r) {
    int m = l + (r - l) / 2;  // Avoid overflow
    if(arr[m] == target) return m;  // Found!
    if(arr[m] < target) l = m + 1; else r = m - 1;  // Narrow search
  }
  return -1;  // Not found
}`
    },
    related: ['binary-search', 'jump-search'],
    tags: ['sorted', 'bounds', 'logarithmic']
  },
  {
    id: 'prims',
    name: "Prim's MST",
    category: 'graph',
    difficulty: 'hard',
    icon: '🕸️',
    timeComplexity: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description: "Prim's algorithm finds the Minimum Spanning Tree (MST) of a weighted undirected graph by constantly picking the smallest edge connecting the growing tree to new vertices.",
    longDesc: `Prim's MST algorithm starts from an arbitrary node and greedily grows the spanning tree by adding the cheapest edge from the tree to a node not yet in the tree. It usually uses a priority queue to efficiently fetch the minimum weight edge.`,
    useCases: 'Network design (LAN, roads, pipes), clustering, traveling salesperson approximation',
    code: {
      javascript: `function primsMST(graph, V) {
  // dist[v] = minimum edge weight connecting v to the MST
  const dist = Array(V).fill(Infinity), parent = Array(V).fill(-1);
  const inMST = new Set();
  dist[0] = 0; // Start building MST from vertex 0
  for (let count = 0; count < V - 1; count++) {
    // Greedily pick the nearest vertex not yet in MST
    let u = -1, min = Infinity;
    for (let v = 0; v < V; v++)
      if (!inMST.has(v) && dist[v] < min) { min = dist[v]; u = v; }
    if (u === -1) break; // No more reachable vertices
    inMST.add(u);
    // Update neighbors: if edge weight is less than current key, update
    for (const [v, w] of graph[u] || [])
      if (!inMST.has(v) && w < dist[v]) { dist[v] = w; parent[v] = u; }
  }
  return parent; // parent[v] = vertex that connects v to the MST
}`,
      python: `import heapq
def prims_mst(graph, V):
    dist, parent, in_mst = [float('inf')] * V, [-1] * V, [False] * V
    dist[0] = 0; pq = [(0, 0)]  # Start from vertex 0
    while pq:
        d, u = heapq.heappop(pq)  # Get minimum weight edge
        if in_mst[u]: continue  # Skip if already in MST
        in_mst[u] = True
        for v, w in graph.get(u, []):  # Check neighbors
            if not in_mst[v] and w < dist[v]:  # Cheaper edge found
                dist[v], parent[v] = w, u
                heapq.heappush(pq, (w, v))
    return parent  # parent[v] = vertex connecting v to MST`,
      cpp: `vector<int> primsMST(vector<vector<pair<int,int>>>& g, int V) {
  vector<int> key(V, INT_MAX), parent(V, -1);
  vector<bool> inMST(V, false);
  // Min-heap: {weight, vertex}
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
  pq.push({0,0}); key[0]=0;  // Start from vertex 0
  while(!pq.empty()) {
    int u = pq.top().second; pq.pop();
    if (inMST[u]) continue;  // Skip if already in MST
    inMST[u] = true;
    for (auto& [v, w] : g[u])  // Check neighbors
      if (!inMST[v] && w < key[v]) {  // Cheaper edge found
        key[v] = w; parent[v] = u; pq.push({key[v], v});
      }
  }
  return parent;  // parent[v] = vertex connecting v to MST
}`,
      java: `int[] primsMST(List<int[]>[] g, int V) {
  int[] key = new int[V];
  int[] parent = new int[V];
  boolean[] inMST = new boolean[V];
  Arrays.fill(key, Integer.MAX_VALUE);
  Arrays.fill(parent, -1);
  // Min-heap: {weight, vertex}
  PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[0] - b[0]);
  pq.add(new int[]{0, 0});
  key[0] = 0;  // Start from vertex 0
  while (!pq.isEmpty()) {
    int u = pq.poll()[1];
    if (inMST[u]) continue;  // Skip if already in MST
    inMST[u] = true;
    for (int[] e : g[u]) {  // Check neighbors
      int v = e[0], w = e[1];
      if (!inMST[v] && w < key[v]) {  // Cheaper edge found
        key[v] = w;
        parent[v] = u;
        pq.add(new int[]{key[v], v});
      }
    }
  }
  return parent;  // parent[v] = vertex connecting v to MST
}`
    },
    related: ['dijkstra', 'kruskal'],
    tags: ['graph', 'greedy', 'mst', 'minimum-spanning-tree']
  },
  {
    id: 'lis',
    name: 'Longest Increasing Subsequence',
    category: 'dp',
    difficulty: 'medium',
    icon: '📈',
    timeComplexity: { best: 'O(n log n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(n)',
    stable: true,
    description: 'LIS finds the length of the longest subsequence in an array where elements are strictly increasing. Standard DP takes O(n²).',
    longDesc: `For each element, we find the longest increasing subsequence that ends with it by looking at all previous elements. The array dp[i] stores the LIS length ending at index i. A more optimized version uses Binary Search to achieve O(n log n), but standard DP is O(n²).`,
    useCases: 'Sequence analysis, version control longest match, predicting trends',
    code: {
      javascript: `function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  // dp[i] = length of longest increasing subsequence ending at index i
  const dp = new Array(nums.length).fill(1); // Each element is an LIS of length 1
  let maxLIS = 1;
  for (let i = 1; i < nums.length; i++) {
    // Check all previous elements for valid extensions
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1); // Extend the subsequence
      }
    }
    maxLIS = Math.max(maxLIS, dp[i]); // Track global maximum
  }
  return maxLIS;
}`,
      python: `def length_of_LIS(nums):
    if not nums: return 0
    dp = [1] * len(nums)  # Each element is an LIS of length 1
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[i] > nums[j]:  # Can extend subsequence
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)  # Length of LIS`,
      cpp: `int lengthOfLIS(vector<int>& nums) {
  if(nums.empty()) return 0;
  vector<int> dp(nums.size(), 1);  // Each element is an LIS of 1
  int res = 1;
  for(int i = 1; i < nums.size(); i++) {
    for(int j = 0; j < i; j++)
      if(nums[i] > nums[j]) dp[i] = max(dp[i], dp[j] + 1);  // Extend
    res = max(res, dp[i]);  // Track global max
  }
  return res;  // Length of LIS
}`,
      java: `int lengthOfLIS(int[] nums) {
  if(nums.length == 0) return 0;
  int[] dp = new int[nums.length];
  Arrays.fill(dp, 1);  // Each element is an LIS of 1
  int res = 1;
  for(int i = 1; i < nums.length; i++) {
    for(int j = 0; j < i; j++)
      if(nums[i] > nums[j]) dp[i] = Math.max(dp[i], dp[j] + 1);  // Extend
    res = Math.max(res, dp[i]);  // Track global max
  }
  return res;  // Length of LIS
}`
    },
    related: ['lcs', 'knapsack'],
    tags: ['dp', 'subsequence', 'optimization']
  }
];

// Helper functions
function getAlgorithmById(id) {
  return ALGORITHMS.find(a => a.id === id);
}
function getAlgorithmsByCategory(cat) {
  return cat === 'all' ? ALGORITHMS : ALGORITHMS.filter(a => a.category === cat);
}
function getAlgorithmsByDifficulty(diff) {
  return ALGORITHMS.filter(a => a.difficulty === diff);
}
function searchAlgorithms(query) {
  const q = query.toLowerCase();
  return ALGORITHMS.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q) ||
    a.tags.some(t => t.includes(q))
  );
}

// Category metadata
const CATEGORIES = {
  sorting: { label: 'Sorting', icon: '↕️', color: '#818cf8' },
  searching: { label: 'Searching', icon: '🔍', color: '#22d3ee' },
  graph: { label: 'Graph', icon: '🕸️', color: '#c084fc' },
  dp: { label: 'Dynamic Programming', icon: '🧩', color: '#fb923c' }
};

const DIFFICULTY_META = {
  easy: { label: 'Easy', color: '#22c55e' },
  medium: { label: 'Medium', color: '#eab308' },
  hard: { label: 'Hard', color: '#ef4444' }
};

// Quiz questions per algorithm
const QUIZ_QUESTIONS = {
  'bubble-sort': [
    { q: 'What is the worst-case time complexity of Bubble Sort?', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], ans: 2, exp: 'Bubble Sort has O(n²) comparisons in the worst case when the array is reverse sorted.' },
    { q: 'Is Bubble Sort a stable sorting algorithm?', opts: ['Yes', 'No', 'Depends on implementation', 'Only for integers'], ans: 0, exp: 'Bubble Sort is stable because equal elements are never swapped past each other.' },
    { q: 'What is the best-case time complexity of Bubble Sort with optimization?', opts: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'], ans: 2, exp: 'With the "swapped" flag optimization, Bubble Sort achieves O(n) on an already sorted array.' },
    { q: 'What data structure is used as auxiliary space?', opts: ['Queue', 'Stack', 'None (in-place)', 'Hash Map'], ans: 2, exp: 'Bubble Sort is an in-place algorithm, requiring only O(1) auxiliary space.' }
  ],
  'merge-sort': [
    { q: 'What technique does Merge Sort use?', opts: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'], ans: 2, exp: 'Merge Sort uses divide and conquer — split, sort, merge.' },
    { q: 'What is the space complexity of Merge Sort?', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], ans: 2, exp: 'Merge Sort requires O(n) extra space for the temporary arrays during merging.' },
    { q: 'Which sorting algorithm does NOT have a worst case of O(n log n)?', opts: ['Merge Sort', 'Heap Sort', 'Quick Sort', 'All have O(n log n) worst case'], ans: 2, exp: 'Quick Sort has O(n²) worst case (when pivot is always min or max).' },
    { q: 'Merge Sort is most suitable for:', opts: ['Small arrays', 'Linked lists', 'Random access arrays', 'Hash maps'], ans: 1, exp: 'Merge Sort is excellent for linked lists since it does not require random access.' }
  ],
  'binary-search': [
    { q: 'Binary Search requires the array to be:', opts: ['Unsorted', 'Sorted', 'Partially sorted', 'Any order'], ans: 1, exp: 'Binary Search only works on sorted arrays.' },
    { q: 'What is the time complexity of Binary Search?', opts: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], ans: 1, exp: 'Binary Search divides the search space in half each time, giving O(log n) complexity.' },
    { q: 'How many comparisons does Binary Search need for 1024 elements?', opts: ['512', '64', '10', '1024'], ans: 2, exp: 'Binary Search needs at most log₂(1024) = 10 comparisons.' },
    { q: 'Binary Search on an unsorted array:', opts: ['Works correctly', 'Is faster', 'May give wrong results', 'Is the same as linear search'], ans: 2, exp: 'Binary Search requires a sorted array; applying it to unsorted data gives incorrect results.' }
  ],
  'bfs': [
    { q: 'BFS uses which data structure?', opts: ['Stack', 'Queue', 'Heap', 'Array'], ans: 1, exp: 'BFS uses a queue to track vertices to visit (FIFO order).' },
    { q: 'BFS guarantees shortest path in:', opts: ['Weighted graphs', 'Directed graphs', 'Unweighted graphs', 'All graphs'], ans: 2, exp: 'BFS finds the shortest path (in terms of edges) in unweighted graphs.' },
    { q: 'The time complexity of BFS is:', opts: ['O(V)', 'O(E)', 'O(V+E)', 'O(V²)'], ans: 2, exp: 'BFS visits every vertex and edge once, giving O(V+E) complexity.' },
    { q: 'BFS explores vertices in which order?', opts: ['Depth first', 'Level by level', 'Randomly', 'Alphabetically'], ans: 1, exp: 'BFS explores all vertices at the current depth level before moving to the next.' }
  ],
  'quick-sort': [
    { q: 'What is the average time complexity of Quick Sort?', opts: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'], ans: 2, exp: 'Quick Sort has O(n log n) average case time complexity.' },
    { q: 'Quick Sort performs worst when:', opts: ['Array is random', 'Pivot is always median', 'Array is already sorted', 'Array has duplicates'], ans: 2, exp: 'When array is already sorted and pivot is always first/last, Quick Sort degrades to O(n²).' },
    { q: 'Is Quick Sort a stable algorithm?', opts: ['Yes', 'No', 'Sometimes', 'Depends on pivot'], ans: 1, exp: 'Quick Sort is not stable by default — equal elements may change relative order.' },
    { q: 'Quick Sort space complexity is:', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], ans: 2, exp: 'Quick Sort uses O(log n) stack space for recursion.' }
  ],
  'radix-sort': [
    { q: 'What type of sort is Radix Sort?', opts: ['Comparison', 'Non-comparison', 'Divide and conquer', 'Greedy'], ans: 1, exp: 'Radix Sort is a non-comparison sort; it uses Counting Sort as a subroutine.' },
    { q: 'What is the time complexity of Radix Sort?', opts: ['O(n log n)', 'O(n²)', 'O(nk)', 'O(n)'], ans: 2, exp: 'O(nk) where n is the number of elements and k is the number of digits.' }
  ],
  'exponential-search': [
    { q: 'What is the main advantage of Exponential Search?', opts: ['Works on unsorted arrays', 'Fast for unbounded arrays', 'O(1) time complexity', 'In-place search'], ans: 1, exp: 'Exponential Search is highly efficient for unbounded arrays by doubling the search boundary.' },
    { q: 'What search is used as a subroutine in Exponential Search?', opts: ['Linear Search', 'Jump Search', 'Binary Search', 'Interpolation Search'], ans: 2, exp: 'Once the bounds are found, Exponential Search uses Binary Search.' }
  ],
  'prims': [
    { q: "What does Prim's algorithm find?", opts: ['Shortest Path', 'Minimum Spanning Tree', 'Maximum Flow', 'Topological Sort'], ans: 1, exp: "Prim's algorithm finds the Minimum Spanning Tree of a graph." },
    { q: "What data structure is commonly used in Prim's?", opts: ['Stack', 'Queue', 'Priority Queue', 'Linked List'], ans: 2, exp: "A Priority Queue is used to efficiently pick the edge with the minimum weight." }
  ],
  'lis': [
    { q: 'What does LIS stand for?', opts: ['Linear Insertion Sort', 'Logarithmic Interpolation Search', 'Longest Increasing Subsequence', 'Lowest Integer Sum'], ans: 2, exp: 'LIS stands for Longest Increasing Subsequence.' },
    { q: 'What is the time complexity of compiling LIS using strictly standard DP?', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'], ans: 2, exp: 'The standard DP approach to LIS has O(n²) time complexity.' }
  ]
};
