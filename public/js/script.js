function openCase(caseName) {
  // ���������� ��������� ����
  const modal = document.getElementById('case-modal');
  modal.style.display = 'flex';
  
  // ����� ����� �������� ������ ��� ������������� ���������� div.case-items,
  // �������� �������� ��������� ��������� ������.
  // ��� ������� ��������� �������, ����� �������� �������� ���������� � ��������� ���������.
  
  setTimeout(() => {
    // ���������� POST-������ ��� �������� ����� �� �������
    fetch('/cases/open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseName })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("�����������, �� ��������: " + data.item.name);
        // ����� ����� �������� ������ ������������, ��������, ������ � ���������
      } else {
        alert("������: " + data.message);
      }
      modal.style.display = 'none';
    })
    .catch(err => {
      console.error(err);
      modal.style.display = 'none';
    });
  }, 3000); // �������� ������ 3 �������
}
